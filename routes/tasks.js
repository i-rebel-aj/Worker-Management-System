const express=require("express")
const router=express.Router();
const {User}= require('../models/User')
const {Task}=require('../models/Tasks')
const {renderTaskform, addTask}=require('../controllers/task')
const {isManager, isWorker}=require('../middlewares/authorization')
const {isLoggedIn}=require('../middlewares/authentication')
router.get('/', [isLoggedIn, isManager], renderTaskform)
router.post('/',[isLoggedIn, isManager] ,addTask)
module.exports=router