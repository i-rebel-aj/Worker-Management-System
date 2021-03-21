const mongoose=require("mongoose")
const {User}= require('../models/User')
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
        taskdocsFilePath:{
            ManagerDocs:[
                {
                    path: String,
                    description: String
                }
            ]
        },
        submission:{
            submissionDescription:{
                type: String
            },
            WorkerDocs: [{
                path: String,
                name: String,
                mime_type: String,
                file_type: String
            }],
            submissionDate:{
                type: Date
            },
            submittedBy:{
                //Keep email for the time being
                type: String
            }
        },
        completeStatus:{
            type: Boolean,
            default: false
        },
        underVerificationStatus:{
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