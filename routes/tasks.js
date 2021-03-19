const express=require("express")
const router=express.Router();
const {User}= require('../models/User')
const {Task}=require('../models/Tasks')
const {renderTaskform, addTask, displayEditTaskform, editTask, markCompleted}=require('../controllers/task')
const {isManager, isWorker}=require('../middlewares/authorization')
const {isLoggedIn}=require('../middlewares/authentication')
router.get('/', [isLoggedIn, isManager], renderTaskform)
router.post('/',[isLoggedIn, isManager] ,addTask)
router.get('/:id/edit',[isLoggedIn, isManager], displayEditTaskform)
router.put('/:id',[isLoggedIn, isManager],editTask)
//router.post('/:id/complete', [isLoggedIn, isManager], markCompleted)
module.exports=router