const express=require('express')
const cors=require('cors')
const app=express()
const dbserver=require('./dbserver')
app.use(cors())
app.use(express.json())
const port=5000
const userroute=require('./routes/Userroute')
app.use('/api/user/',userroute)
app.get('/',(req,res)=>res.send("working"))
app.listen(port,()=>console.log("working"))
//GwuhDGnFqJT5Uzid

