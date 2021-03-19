const {User} = require("../models/User");
const {Task}=require('../models/Tasks')

exports.renderTaskform=async (req, res)=>{
    try{
        const workerList= await User.find({Type: 'Worker'})
        //console.log(workerList)
        res.render('taskform', {workers: workerList})
    }catch(err){
        console.log(err)
        res.redirect('/')
    }
}

exports.addTask = async (req, res)=>{
    //console.log(req.body)
    try{
        if(!req.body||!req.body.task_name||!req.body.description){
            req.flash('error', 'Please fill all the fields')
            res.redirect('/task')
        }
        if(!req.body.assignedworkers){
            req.flash('error', 'Must select atleast one worker')
            res.redirect('/task')
        }else{
            const workerList=req.body.assignedworkers
            const name=req.body.task_name
            const description=req.body.description
            const deadline=new Date(req.body.deadline)
            const today = new Date();
            const newTask={name: name, description: description, AssignedBy: req.session.user._id, deadline: deadline}
            const task=new Task(newTask)
            if(deadline.getTime()<today.getTime()){
                req.flash('error', 'Please enter a valid date, i.e one in future')
                res.redirect('/task')
            }
            //console.log(task)
            if(typeof(workerList)==='object'){
                for(let i=0;i<workerList.length;i++){
                    //console.log(workerList[i])
                    let foundWorker= await User.findOne({email: workerList[i]}) 
                    task.AssignedTo.push(foundWorker._id)
                }
            }else if(typeof(workerList)==='string'){
                let foundWorker= await User.findOne({email: workerList}) 
                task.AssignedTo.push(foundWorker._id)
            }
            //console.log(task)
            await task.save()
            req.flash('success', 'Task added successfully')
            res.redirect('/manager')
        }
    }catch(err){
        console.log(err)
        res.redirect('/')
    }
}

exports.markCompleted = async (req, res)=>{
    const taskId= req.params.id
    try{
        const foundtask= await Task.findById(taskId)
        if(!foundtask){
            req.flash('error', 'Task not found')
            res.redirect('/manager')
        }else{
            if(foundtask.completeStatus){
                req.flash('error', 'Task is already completed')
                res.redirect('/manager')
            }else{
                foundtask.completeStatus=true
                await foundtask.save()
                req.flash('success', 'Task marked completed')
                //Redirect to manager home page
                res.redirect('/manager')
            }
        }
    }catch(err){
        console.log(err)
        res.redirect('/error')
    }  
}
exports.displayEditTaskform= async (req, res)=>{
    const taskID= req.params.id;
    try{
        const foundTask= await Task.findById(taskID)
        const workers= await User.find({Type: 'Worker'})
        if(!workers){
            req.flash('error', 'There are no workers to assign task to')
            res.redirect('/')
        }
        if(!foundTask){
            req.flash('error', 'Task not found')
            res.redirect('/error')
        }else{
            res.render('editTaskForm', {task: foundTask, workers: workers})
        }
    }catch(err){
        console.log(err)
        res.redirect('/')
    }
    
}

exports.editTask= async (req, res)=>{
    const taskID= req.params.id;
    const foundTask= await Task.findById(taskID)
    if(!foundTask){
        req.flash('error', 'Task not found')
        res.redirect('/error')
    }else{
        const workerList=req.body.assignedworkers
        const name=req.body.task_name
        const description=req.body.description
        const deadline=new Date(req.body.deadline)
        let AssignedTo=[]
        const today = new Date();
        if(deadline.getTime()<today.getTime()){
            req.flash('error', 'Please enter a valid date, i.e one in future')
            res.redirect('/manager/tasks/1')
        }
        if(typeof(workerList)==='object'){
            for(let i=0;i<workerList.length;i++){
                let foundWorker= await User.findOne({email: workerList[i]}) 
                AssignedTo.push(foundWorker._id)
            }
        }else if(typeof(workerList)==='string'){
            let foundWorker= await User.findOne({email: workerList}) 
            AssignedTo.push(foundWorker._id)
        }
        let respone=""
        if(name&&foundTask.name!==name){
            respone+=' Name '
            foundTask.name=name
        }
        if(description&& foundTask.description!==description){
            respone+=' Description ' 
            foundTask.description = description
        }
        if(deadline && foundTask.deadline!==deadline){
            respone+=' Deadline ' 
            foundTask.description = description
        }
        if(AssignedTo.length!==foundTask.AssignedTo.length){
            respone+=' Workers List '
            foundTask.AssignedTo=AssignedTo
        }else{
            for (const workerid of AssignedTo) {
                if(foundTask.AssignedTo.indexOf(workerid)===-1){
                    respone+=' Workers List '
                    foundTask.AssignedTo=AssignedTo
                    break;
                }
            }
        }
        console.log(foundTask)
        await foundTask.save()
        req.flash('success', `Edited Task ${respone} for ${foundTask.name}`)
        res.redirect('/manager/tasks/1')
    }
}