const mongoose=require('mongoose')
//const URL='mongodb+srv://sravyasrinivas788:GwuhDGnFqJT5Uzid@cluster0.luvz2sx.mongodb.net/Resume'
const URL='mongodb://127.0.0.1:27017/Resume'
mongoose.connect(URL,{useNewUrlParser: true, useUnifiedTopology: true,})
const con=mongoose.connection
con.on('connected',()=>{
    console.log("connected")
})
con.on('error',()=>{
    console.log("error")
})