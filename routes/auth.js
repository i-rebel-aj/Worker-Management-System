const express=require("express")
const router=express.Router();
const {addUser, userLogin, logout}=require('../controllers/auth')

router.post('/signup', addUser)
router.post('/login', userLogin)
router.get('/logout', logout)


router.get('/login', (req, res)=>{
    res.render('login')
})
router.get('/signup', (req,res)=>{
    res.render('signup')
})

module.exports=router