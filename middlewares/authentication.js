exports.isLoggedIn= (req, res, next)=>{
    if(!res.locals.currentUser){
        req.flash('error', 'You are not logged in')
        res.redirect('/user/auth/login')
    }else{
        next()
    }
}