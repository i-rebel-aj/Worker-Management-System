const {Manager} = require("../models/User");
const Tasks=require('../models/Tasks')

exports.displayTaskForm= async(req, res)=>{
    res.render('taskform')
}