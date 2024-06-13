const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const bcrypt=require("bcryptjs")      //for encryption
const {blogsmodel}=require("./models/blog")
const jwt=require("jsonwebtoken") //json web token importing


const app=express()
app.use(cors())
app.use(express.json())

const generateHashedPassword=async (Password)=>{
const salt=await bcrypt.genSalt(10)  //salt factor used for iteration
return bcrypt.hash(Password,salt)

}
mongoose.connect("mongodb+srv://annajose:annajose01@cluster0.d4hgr.mongodb.net/blogdb?retryWrites=true&w=majority&appName=Cluster0")

//signup api
app.post("/signup",async (req,res)=>{
    let input=req.body
    let hashedPassword=await generateHashedPassword(input.password)
    console.log(hashedPassword)
    input.password=hashedPassword
    let blog=new blogsmodel(input)
    blog.save()
    res.json({"status":"success"})
})

//signin api
app.post("/signin",(req,res)=>{
  let input=req.body
  blogsmodel.find({"emailId":req.body.emailId}).then((response)=>{
    if (response.length>0) {
        
        let dbPassword=response[0].password
        console.log(dbPassword)
        bcrypt.compare(input.password,dbPassword,(error,isMatch)=>{
            if (isMatch) {

             jwt.sign({email:input.emailId},"blog-app",{expiresIn:"1d"},(error,token)=>{
                if (error) {
                    res.json({"status":"unable to create token"})
                    
                } else {
                    res.json({"status":"success","userId":response[0]._id,"token":token}) 
                }
             })  //1d=one day,1h=one hour

                
                
            } else {
                res.json({"status":"password incorrect"})
                
            }
        })

    } else {
        res.json({"status":"User Not Found"})
        
    }
  }).catch()

})

app.listen(8080,()=>{
    console.log("server started")
})