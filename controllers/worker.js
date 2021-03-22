const {pagination}=require('../lib/helper')
const {User} = require("../models/User")
const {Task}=require('../models/Tasks')
exports.displayWorkerHome= async(req, res)=>{
    //Display all tasks
    try{
        const pageInfo=await pagination(req, {AssignedTo: req.session.user._id})
        const tasks=await Task.find({AssignedTo: req.session.user._id}).skip((pageInfo.perPage*pageInfo.page)-pageInfo.perPage).limit(pageInfo.perPage).populate('AssignedBy', 'name').populate('AssignedTo', 'name email')
        console.log(tasks.length)
        res.render('manager_portal', {tasks: tasks, currentPage: pageInfo.page, totalPages: pageInfo.totalPages, searchBycompleted: false, searchByPending: false, searchByDate: false, searchByTaskName: false})
    }catch(err){
        console.log(err)
        res.redirect('/')
    }
}
exports.getCompletedTasks=async (req, res)=>{
    //Display completed tasks
    try{
        const pageInfo=await pagination(req, {AssignedTo: req.session.user._id, completeStatus: true})
        const tasks=await Task.find({AssignedTo: req.session.user._id, completeStatus: true}).skip((pageInfo.perPage*pageInfo.page)-pageInfo.perPage).limit(pageInfo.perPage).populate('AssignedBy', 'name').populate('AssignedTo', 'name email')
        res.render('manager_portal', {tasks: tasks, currentPage: pageInfo.page, totalPages: pageInfo.totalPages, searchBycompleted: true, searchByPending: false, searchByDate: false, searchByTaskName: false})
    }catch(err){
        console.log(err)
        res.redirect('/')
    }
}
exports.displayPendingTasks= async(req, res)=>{
    try{
        const pageInfo=await pagination(req, {AssignedTo: req.session.user._id, completeStatus: false})
        const tasks=await Task.find({AssignedTo: req.session.user._id, completeStatus: false}).skip((pageInfo.perPage*pageInfo.page)-pageInfo.perPage).limit(pageInfo.perPage).populate('AssignedBy', 'name').populate('AssignedTo', 'name email')
        res.render('manager_portal', {tasks: tasks, currentPage: pageInfo.page, totalPages: pageInfo.totalPages, searchBycompleted: false, searchByPending: true, searchByDate: false, searchByTaskName: false})
    }catch(err){
        console.log(err)
        res.redirect('/')
    }
}
exports.displaySubmissionForm =async(req, res)=>{
    const taskId= req.params.id;
    try{
        const foundTask=await Task.findById(taskId)
        if(!foundTask){
            req.flash('error', 'Task not found')
            res.redirect('/error')
        }
        res.render('submissionform', {task: foundTask})
    }catch(err){
        console.log(err)
        res.redirect('/error')
    }
}
exports.searchByName =async(req, res)=>{
    try{
        const pageInfo=await pagination(req, {AssignedTo: req.session.user._id, name: req.body.name})
        const tasks=await Task.find({name: req.body.name}).skip((pageInfo.perPage*pageInfo.page)-pageInfo.perPage).limit(pageInfo.perPage).populate('AssignedBy', 'name').populate('AssignedTo', 'name email')
        res.render('manager_portal', {tasks: tasks, currentPage: pageInfo.page, totalPages: pageInfo.totalPages, searchBycompleted: false, searchByPending: false, searchByDate: true, searchByTaskName: true})
    }catch(err){
        console.log(err)
        res.redirect('/error')
    }
}