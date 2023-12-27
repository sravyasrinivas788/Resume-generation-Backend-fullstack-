

const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  mimetype: String,
  size: Number,
  // rollNumber:String,
  created_at: { type: Date, default: Date.now },
  RollNumber:{type:String,required:true},
  skills:{type:Array,default:[]},
  placementStatus: { type: String, default: 'Pending' },


});

const Resumemodel = mongoose.model('Resume', resumeSchema);

module.exports = Resumemodel;
