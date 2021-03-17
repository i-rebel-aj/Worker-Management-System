const {Manager} = require("../models/User");
const Tasks=require('../models/Tasks')

exports.displayMangerHome= async(req, res)=>{
    res.render('manager_portal')
}