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