/*
    To be added for load testing
*/
const faker = require('faker') 
const {Task}= require('../models/Tasks')
const {User}= require('../models/User')
const mongoose=require("mongoose")
mongoose.connect('<Your_DB_URL>', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(()=>{
    console.log("Connected to mongoDB")
}).catch((err)=>{
    console.log(err)
})
// Add 30 random Pending tasks
const getRandomAssignedTo = async ()=>{
    const workers= await User.find({Type: 'Worker'})
    //Max all min 1
    const max_assignees= Math.floor(Math.random()*(workers.length-1)+1)
    let ans=[]
    for(let i=0;i<max_assignees;i++){
        ans.push(workers[i]._id)
    }
    console.log(ans)
    return ans
}
const createPendingTask = async()=>{
    try{
        const managers= await User.find({Type: 'Manager'})    
        for(let i=0;i<30;i++){
            let newtask={
                name: faker.lorem.sentence(),
                description: faker.lorem.paragraph(),
                AssignedTo: await getRandomAssignedTo(),
                AssignedBy: managers[Math.floor(Math.random()*(managers.length-1))]._id,
                submission:{},
                completeStatus:false,
                underVerificationStatus: false,
                deadline: faker.date.future()
            }
            let assignedBy=await User.findById(newtask.AssignedBy) 
            console.log(assignedBy.email)
            let task=new Task(newtask)
            await task.save()
        }
    }catch(err){
        console.log(err)
    }
   
}
createPendingTask()