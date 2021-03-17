const mongoose=require("mongoose")
const workerSchema= new mongoose.Schema(
    {
        rewardPoints:{
            type: Number,
            default: 0
        }
    }
)
module.exports=workerSchema