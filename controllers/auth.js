const { User, Manager, Worker } = require("../models/User");
const bcrypt = require("bcrypt");

exports.addUser = async (req, res) => {
  const type = req.body.Type;
  const email = req.body.email;
  const pass=req.body.password
  const name=req.body.name
  const confirmpass=req.body.confirmpass
  if(pass!==confirmpass){
      req.flash('error', 'Passwords do not match')
      res.redirect('/user/auth/signup')
  }else{
      try{
        if(type==='Manager'){
            //Hashing the password
            const newManager={email: email, password: pass, name: name}
            const salt = bcrypt.genSaltSync(10);
            newManager.password = bcrypt.hashSync(newManager.password, salt);
            const manager=new Manager(newManager)
            await manager.save()
            req.flash("success", "You are now signed in");
            //Setting Up the session
            req.session.isLoggedIn = true;
            req.session.user = manager;
            //console.log(req.session)
            res.redirect("/");
        }else if(type==='Worker'){
            //Hashing the password
            const newWorker={email: email, password: pass, name: name}
            const salt = bcrypt.genSaltSync(10);
            newWorker.password = bcrypt.hashSync(newWorker.password, salt);
            const worker=new Worker(newWorker)
            await worker.save()
            req.flash("success", "You are now signed in");
            //Setting Up the session
            req.session.isLoggedIn = true;
            req.session.user = worker;
            res.redirect("/");
        }else{
            req.flash("error", "Designation not selected");
            res.redirect("/user/auth/signup");
        }
      }catch(err){
          //console.log(err)
        if (err.code === 11000) {
            if (err.keyValue.email) {
                req.flash("error", "Email already exists")
                res.redirect('/user/auth/signup')
            }
          }
          res.redirect('/error')
        }
      }
}

exports.userLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const pass = req.body.password;
    const user = await User.findOne({ email: email });
    if (!user||!user.authenticate(pass)) {
        req.flash("error", "Invalid username or pass");
        res.redirect("/user/auth/login");
    } else {
        req.flash("success", "You are now signed in");
        req.session.isLoggedIn = true;
        req.session.user = user;
        res.redirect("/");
      
    }
  } catch (err) {
    //console.log(err)
    res.redirect('/error');
  }
};

exports.editUser = async (req, res)=>{
    console.log(req.body)
    const user= await User.findById(req.session.user._id)
    if(req.body.name){
        user.name= req.body.name
    }
    if(req.body.email){
        user.email= req.body.email
    }
    await user.save()
    req.session.user = user;
    req.flash('success', 'Details added successfully')
    res.redirect('back')
}

exports.logout = async(req,res)=>{
    //console.log(req.session)
    if (req.session) {
        req.session.destroy(function(err) {
            if (err) {
                //console.log(err)
                res.redirect('/error')
            } else {
                req.session=null
                res.redirect('/');
            }
        });
    }
};