const express=require("express")
const router=express.Router();
const {displayMangerHome}= require('../controllers/manager')
const {isManager, isWorker}=require('../middlewares/authorization')
const {isLoggedIn}=require('../middlewares/authentication')
router.get('/',[isLoggedIn,isManager],displayMangerHome)
module.exports=router