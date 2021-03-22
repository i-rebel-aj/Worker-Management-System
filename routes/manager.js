const express=require("express")
const router=express.Router();
const {displayMangerHome, displayCompletedTasks, displayPendingTasks, searchByDate}= require('../controllers/manager')
const {isManager, isWorker}=require('../middlewares/authorization')
const {isLoggedIn}=require('../middlewares/authentication')
router.get('/tasks', (req, res)=>{
    res.redirect('/manager/tasks/1')
})
router.get('/tasks/completed', [isLoggedIn,isManager],(req, res)=>{
    res.redirect('/manager/tasks/completed/1')
})
router.get('/tasks/pending',[isLoggedIn,isManager], (req, res)=>{
    res.redirect('/manager/tasks/pending/1')
})
// router.get('/tasks/date',[isLoggedIn,isManager], (req, res)=>{
//     res.redirect('/manager/tasks/date/1')
// })
router.get('/tasks/date',[isLoggedIn,isManager],searchByDate)
router.get('/tasks/completed/:page',[isLoggedIn,isManager],displayCompletedTasks)
router.get('/tasks/pending/:page',[isLoggedIn,isManager],displayPendingTasks)
router.get('/tasks/:page',[isLoggedIn,isManager],displayMangerHome)
module.exports=router