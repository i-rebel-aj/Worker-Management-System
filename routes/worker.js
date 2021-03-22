const express=require("express")
const router=express.Router();
const {displaySubmissionForm, displayWorkerHome, displayPendingTasks, getCompletedTasks, searchByName}= require('../controllers/worker')
const {isManager, isWorker}=require('../middlewares/authorization')
const {isLoggedIn}=require('../middlewares/authentication')
router.get('/tasks', (req, res)=>{
    res.redirect('/worker/tasks/1')
})
router.get('/tasks/pending', [isLoggedIn,isWorker],(req, res)=>{
    res.redirect('/worker/tasks/pending/1')
})
router.get('/tasks/completed', [isLoggedIn,isWorker],(req, res)=>{
    res.redirect('/worker/tasks/completed/1')
})
router.get('/tasks/name',[isLoggedIn,isWorker],searchByName)

router.get('/tasks/pending/:page',[isLoggedIn,isWorker],displayPendingTasks)

router.get('/tasks/completed/:page',[isLoggedIn,isWorker],getCompletedTasks)

router.get('/task/:id/submission', [isLoggedIn, isWorker],displaySubmissionForm)

router.get('/tasks/:page',[isLoggedIn, isWorker], displayWorkerHome)

module.exports=router