const mongoose=require("mongoose")
const ManagerSchema=require("./Schema/manager")
const WorkerSchema=require("./Schema/worker")
const bcrypt = require("bcrypt");
const options={discriminatorKey: 'Type'}
const userSchema=new mongoose.Schema(
    {
        //Common Entries Goes Here
        email:{
            type: String,
            required: true,
            unique: true
        },
        password:{
            type: String,
            required: true
        },
        name:{
            type: String,
            required: true
        }
    },options,{timestamps: true}
)

userSchema.methods = {
    authenticate: function  (plainpassword) {
      const isValidPass = bcrypt.compareSync(plainpassword, this.password);
      console.log(plainpassword)
      console.log(isValidPass)
      if(isValidPass){
        return true;
      }else{
        return false;
      }
    }
}

const User=mongoose.model('User', userSchema)
const Manager=User.discriminator('Manager', ManagerSchema)
const Worker=User.discriminator('Worker', WorkerSchema)


module.exports={User, Manager, Worker}