const mongoose=require("mongoose")
const bcrypt = require("bcrypt");
const taskSchema=new mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        description:{
            type: String,
            required: true
        },
        AssignedTo:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        AssignedBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        docsFilePath:[
            {
                path: String
            }
        ],
        completeStatus:{
            type: Boolean,
            default: false
        },
        deadline:{
            type: Date,
            required: true
        }
    },{timestamps: true}
)

const Task=mongoose.model('Task', taskSchema)

module.exports={Task}