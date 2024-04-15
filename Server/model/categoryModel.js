const mongoose=require('mongoose');
const {Schema}=mongoose;
const categorySchema= new Schema({
    name:{
        type:String,
        required:true,
    
    },
    description:{
        type:String
    },
    imgURL:{
        type:String
    },
    IsActive:{
        type:Boolean,
        default:true
    },
},
    {timestamps:true}
)
const Category=mongoose.model("Category",categorySchema);
module.exports=Category