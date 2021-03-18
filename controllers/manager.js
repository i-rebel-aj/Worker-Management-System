const {User} = require("../models/User");
const {Task}=require('../models/Tasks')

exports.displayMangerHome= async(req, res)=>{
    try{
        //Displaying all tasks
        const perPage=10
        const page=req.params.page || 1
        // const totalPages=Math.ceil(await Task.find({AssignedBy: req.session.user._id}).length/perPage) 
        const totalTasks=await Task.find({AssignedBy: req.session.user._id})
        const totalPages=Math.ceil(totalTasks.length/perPage)
        console.log(`Total Page count is ${totalPages}`)
        const tasks=await Task.find({AssignedBy: req.session.user._id}).skip((perPage*page)-perPage).limit(perPage).populate('AssignedBy', 'name').populate('AssignedTo', 'name email')
        console.log(tasks)
        res.render('manager_portal', {tasks: tasks, currentPage: page, totalPages: totalPages})
    }catch(err){
        console.log(err)
        res.redirect('/')
    }
    
}