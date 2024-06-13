const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const bcrypt=require("bcryptjs")      //for encryption
const {blogsmodel}=require("./models/blog")


const app=express()
app.use(cors())
app.use(express.json())

const generateHashedPassword=async (Password)=>{
const salt=await bcrypt.genSalt(10)  //salt factor used for iteration
return bcrypt.hash(Password,salt)

}
mongoose.connect("mongodb+srv://annajose:annajose01@cluster0.d4hgr.mongodb.net/blogdb?retryWrites=true&w=majority&appName=Cluster0")

app.post("/signup",async (req,res)=>{
    let input=req.body
    let hashedPassword=await generateHashedPassword(input.password)
    console.log(hashedPassword)
    input.password=hashedPassword
    let blog=new blogsmodel(input)
    blog.save()
    res.json({"status":"success"})
})

app.listen(8080,()=>{
    console.log("server started")
})