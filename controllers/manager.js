const {User} = require("../models/User");
const {Task}=require('../models/Tasks')
const {pagination}=require('../lib/helper')
exports.displayMangerHome= async(req, res)=>{
    try{
        const pageInfo=await pagination(req, {AssignedBy: req.session.user._id})
        const tasks=await Task.find({AssignedBy: req.session.user._id}).skip((pageInfo.perPage*pageInfo.page)-pageInfo.perPage).limit(pageInfo.perPage).populate('AssignedBy', 'name').populate('AssignedTo', 'name email')
        res.render('manager_portal', {tasks: tasks, currentPage: pageInfo.page, totalPages: pageInfo.totalPages, searchBycompleted: false, searchByPending: false, searchByDate: false, searchByTaskName: false})
    }catch(err){
        console.log(err)
        res.redirect('/')
    }
}
exports.displayCompletedTasks= async(req, res)=>{
    try{
        const pageInfo=await pagination(req, {AssignedBy: req.session.user._id, completeStatus: true})
        const tasks=await Task.find({AssignedBy: req.session.user._id, completeStatus: true}).skip((pageInfo.perPage*pageInfo.page)-pageInfo.perPage).limit(pageInfo.perPage).populate('AssignedBy', 'name').populate('AssignedTo', 'name email')
        res.render('manager_portal', {tasks: tasks, currentPage: pageInfo.page, totalPages: pageInfo.totalPages, searchBycompleted: true, searchByPending: false, searchByDate: false, searchByTaskName: false})
    }catch(err){
        console.log(err)
        res.redirect('/')
    }
}
exports.displayPendingTasks= async(req, res)=>{
    try{
        const pageInfo=await pagination(req, {AssignedBy: req.session.user._id, completeStatus: false})
        const tasks=await Task.find({AssignedBy: req.session.user._id, completeStatus: false}).skip((pageInfo.perPage*pageInfo.page)-pageInfo.perPage).limit(pageInfo.perPage).populate('AssignedBy', 'name').populate('AssignedTo', 'name email')
        res.render('manager_portal', {tasks: tasks, currentPage: pageInfo.page, totalPages: pageInfo.totalPages, searchBycompleted: false, searchByPending: true, searchByDate: false, searchByTaskName: false})
    }catch(err){
        console.log(err)
        res.redirect('/error')
    }
}
exports.searchByDate =async(req, res)=>{
    try{
        const pageInfo=await pagination(req, {AssignedBy: req.session.user._id, deadline: { $gt: req.body.start, $lt: req.body.end }})
        const tasks=await Task.find({deadline: { $gt: req.body.start, $lt: req.body.end }}).skip((pageInfo.perPage*pageInfo.page)-pageInfo.perPage).limit(pageInfo.perPage).populate('AssignedBy', 'name').populate('AssignedTo', 'name email')
        res.render('manager_portal', {tasks: tasks, currentPage: pageInfo.page, totalPages: pageInfo.totalPages, searchBycompleted: false, searchByPending: false, searchByDate: true, searchByTaskName: false})
    }catch(err){
        console.log(err)
        res.redirect('/error')
    }
}