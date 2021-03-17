//const User= require('../models/User')
exports.isManager= (req, res, next)=>{
    if(res.locals.currentUser.Type==='Manager'){
       next()
    }else{
        req.flash('error', 'You are not a manager')
        res.redirect('/')
    }
}
exports.isWorker =(req, res, next)=>{
    if(res.locals.currentUser.Type==='Worker'){
       next()
    }else{
        req.flash('error', 'You are not a Worker')
        res.redirect('/')
    }
}