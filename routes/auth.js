const express=require("express")
const router=express.Router();
const {addUser, userLogin, logout, editUser}=require('../controllers/auth')
const {isManager, isWorker}=require('../middlewares/authorization')
const {isLoggedIn}=require('../middlewares/authentication')
router.post('/signup', addUser)
router.post('/login', userLogin)

router.get('/logout', isLoggedIn,logout)
router.get('/edit', isLoggedIn, (req, res)=>{
    res.render('userprofile')
})
router.put('/:id', [isLoggedIn, isWorker], editUser)

router.get('/login', (req, res)=>{
    res.render('login')
})
router.get('/signup', (req,res)=>{
    res.render('signup')
})

module.exports=router