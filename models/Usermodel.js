const mongoose=require('mongoose')
const usermodel=new mongoose.Schema({
    name:{type:String,required:true},
    roll:{type:String,required:true},
    Name:{type:String,default:""},
    RollNumber:{type:String,default:""},
    Email:{type:String,default:""},
    //profileImage:{type:Buffer,default:Buffer.from([])},
    profileImage: { type: String, default: '' }, // Store the image URL or file path
    printedResumes: { type: Array, default: [] }, // New field to store printed resumes



    LinkedIn:{type:String,default:""},
    GitHub:{type:String,default:""},
    Mobile:{type:String,default:""},
    Branch:{type:String,default:""},
    Personal:{type:String,default:""},
    education:{type:Array,default:[]},
    skills:{type:Array,default:[]},
    projects:{type:Array,default:[]},
    internships:{type:Array,default:[]},
    int:{type:Array,default:[]}




},{
    timestamps:true,
});



const Usermodel=mongoose.model('details',usermodel)

module.exports=Usermodel