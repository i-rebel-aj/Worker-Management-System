const express=require("express")
const router=express.Router();
const {displaySubmissionForm, displayWorkerHome}= require('../controllers/worker')
const {isManager, isWorker}=require('../middlewares/authorization')
const {isLoggedIn}=require('../middlewares/authentication')
/*
    Only display task form
*/
router.get('/',[isLoggedIn, isWorker], displayWorkerHome)
router.get('/task/:id/submission', [isLoggedIn, isWorker],displaySubmissionForm)
module.exports=router