const {pagination}=require('../lib/helper')
const {User} = require("../models/User")
const {Task}=require('../models/Tasks')
exports.displayWorkerHome= async(req, res)=>{
    try{
        const pageInfo=await pagination(req)
        const tasks=await Task.find({AssignedTo: req.session.user._id}).skip((pageInfo.perPage*pageInfo.page)-pageInfo.perPage).limit(pageInfo.perPage).populate('AssignedBy', 'name').populate('AssignedTo', 'name email')
        res.render('manager_portal', {tasks: tasks, currentPage: pageInfo.page, totalPages: pageInfo.totalPages})
    }catch(err){
        console.log(err)
        res.redirect('/')
    }
}
exports.getAssignedTasks=async (req, res)=>{

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