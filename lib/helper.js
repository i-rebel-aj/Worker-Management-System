const {Task}=require('../models/Tasks')

exports.pagination= async (req, query)=>{
    const pageInfo={}
    pageInfo.perPage=10
    pageInfo.page=req.params.page || 1
    pageInfo.totalTasks=await Task.find(query)
    pageInfo.totalPages=Math.ceil(pageInfo.totalTasks.length/pageInfo.perPage)
    return pageInfo
}