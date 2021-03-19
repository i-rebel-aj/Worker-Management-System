const express=require("express")
const router=express.Router();
const {displayMangerHome, displayCompletedTasks, displayPendingTasks}= require('../controllers/manager')
const {isManager, isWorker}=require('../middlewares/authorization')
const {isLoggedIn}=require('../middlewares/authentication')
router.get('/tasks', (req, res)=>{
    res.redirect('/manager/tasks/1')
})
router.get('/tasks/completed', (req, res)=>{
    res.redirect('/manager/tasks/completed/1')
})
router.get('/tasks/pending', (req, res)=>{
    res.redirect('/manager/tasks/pending/1')
})
router.get('/tasks/:page',[isLoggedIn,isManager],displayMangerHome)
router.get('/tasks/completed/:page',[isLoggedIn,isManager],displayCompletedTasks)
router.get('/tasks/pending/:page',[isLoggedIn,isManager],displayPendingTasks)
module.exports=router