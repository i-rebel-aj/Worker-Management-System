const {User} = require("../models/User");
const {Task}=require('../models/Tasks')
//Setting up multer to store task-submissions

exports.addSubmission= async(req, res)=>{
    console.log(req.body)
    // console.log(req.file)
    const taskId= req.params.id
    try{
        const foundTask= await Task.findById(taskId)
        if(!foundTask){
            req.flash('error', 'Task not found')
            return res.redirect('/error')
        }
        if(foundTask.underVerificationStatus){
            req.flash('error', 'You or your teammate has already made an submission')
            return res.redirect('back')
        }
        const fileInfo={}
        fileInfo.name=req.file.originalname
        fileInfo.path=req.file.path
        fileInfo.mime_type= req.file.mimetype
        console.log(fileInfo)
        let str=req.file.mimetype
        str=str.replace('/', ' ')
        str=str.split(' ')
        fileInfo.file_type=str[0]
        foundTask.submission.WorkerDocs.push(fileInfo)
        foundTask.submission.submissionDescription=req.body.description
        foundTask.submission.submissionDate=Date.now()
        foundTask.submission.submittedBy= req.session.user.email 
        foundTask.underVerificationStatus=true
        await foundTask.save()
        req.flash('success', 'Task submited sucessfully, review pending')
        return res.redirect('/worker')
    }catch(err){
        console.log(err)
        return res.redirect('/error')
    }
    
}

exports.renderTaskform=async (req, res)=>{
    try{
        const workerList= await User.find({Type: 'Worker'})
        //console.log(workerList)
        return res.render('taskform', {workers: workerList})
    }catch(err){
        console.log(err)
        return res.redirect('/')
    }
}

exports.addTask = async (req, res)=>{
    //console.log(req.body)
    try{
        if(!req.body||!req.body.task_name||!req.body.description){
            req.flash('error', 'Please fill all the fields')
            return res.redirect('/task')
        }
        if(!req.body.assignedworkers){
            req.flash('error', 'Must select atleast one worker')
            return res.redirect('/task')
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
                return res.redirect('/task')
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
            return res.redirect('/manager/tasks/1')
        }
    }catch(err){
        console.log(err)
        return res.redirect('/')
    }
}

exports.markCompleted = async (req, res)=>{
    const taskId= req.params.id
    try{
        if(!req.body.points){
            req.flash('error', 'Points not alloted')
            return res.redirect('back')
        }
        const foundtask= await Task.findById(taskId)
        if(!foundtask){
            req.flash('error', 'Task not found')
            return res.redirect('/manager/tasks/1')
        }else{
            if(foundtask.completeStatus){
                req.flash('error', 'Task is already completed')
                return res.redirect('/manager/tasks/1')
            }else{
                foundtask.completeStatus=true
                //Assigning points to user
                for (const workerId of foundtask.AssignedTo) {
                    let foundUser=await User.findById(workerId)
                    foundUser.rewardPoints+=foundUser.rewardPoints+req.body.points
                    await foundUser.save()
                }
                await foundtask.save()
                req.flash('success', `Task marked completed, given ${req.body.points} to the assigned users`)
                //Redirect to manager home page
                return res.redirect('/manager/tasks/1')
            }
        }
    }catch(err){
        console.log(err)
        return res.redirect('/error')
    }  
}
exports.displayEditTaskform= async (req, res)=>{
    const taskID= req.params.id;
    try{
        const foundTask= await Task.findById(taskID)
        const workers= await User.find({Type: 'Worker'})
        if(!workers){
            req.flash('error', 'There are no workers to assign task to')
            return res.redirect('/')
        }
        if(!foundTask){
            req.flash('error', 'Task not found')
            return res.redirect('/error')
        }else{
            return res.render('editTaskForm', {task: foundTask, workers: workers})
        }
    }catch(err){
        console.log(err)
        return res.redirect('/')
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

exports.deleteTask = async(req, res)=>{
    const taskId= req.params.id
    try{    
        const foundTask=await Task.findByIdAndDelete(taskId)
        if(!foundTask){
            req.flash('error', 'Invalid Id')
            return res.redirect('/error')
        }else{
            req.flash('success', 'Deleted Task')
            return res.redirect('back')
        }
    }catch(err){
        return res.redirect('back')
    }
    
}

exports.displaySubmissionPage= async(req, res)=>{
    try{
        const taskId=req.params.id
        const foundTask= await Task.findById(taskId)
        return res.render('viewsubmission', {task: foundTask})
    }catch(err){
        console.log(err)
        return res.redirect('/error')
    }
}