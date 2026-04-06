import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import { isLoggedIn } from "../middleware/authMiddleware.js"

const router = express.Router()

/* ================= SIGNUP ================= */


router.post("/signup", async (req,res)=>{
try{

const {email,username,password,confirmPassword,secretkey} = req.body

if(!email || !username || !password){
return res.status(400).json({message:"All fields required"})
}

if(password !== confirmPassword){
return res.status(400).json({message:"Passwords do not match"})
}

if(secretkey !== process.env.SECRET_KEY){
return res.status(400).json({message:"Invalid secret key"})
}

const existingUser = await User.findOne({email})

if(existingUser){
return res.status(400).json({message:"User already exists"})
}

const hashedPassword = await bcrypt.hash(password,10)

const newUser = new User({
email,
username,
password:hashedPassword
})

await newUser.save()

res.json({message:"User created successfully"})

}catch(err){

console.log(err)
res.status(500).json({message:"Signup failed"})

}

})

/* ================= SIGNIN ================= */

router.post("/signin", async (req,res)=>{

try{

const {username,password} = req.body

const user = await User.findOne({username})

if(!user){
return res.status(400).json({message:"User not found"})
}

const isMatch = await bcrypt.compare(password,user.password)

if(!isMatch){
return res.status(400).json({message:"Incorrect password"})
}

const token = jwt.sign(
{
id: user._id,
username: user.username,
isLawyer: user.isLawyer,
isJudge: user.isJudge,
isRegistrer: user.isRegistrer
},
process.env.JWT_SECRET,
{expiresIn:"1d"}
)

res.cookie("token",token,{
httpOnly:true,
maxAge:24*60*60*1000
})

res.json({message:"Login successful"})

}catch(err){

console.log(err)
res.status(500).json({message:"Login failed"})

}

})

/* ================= CHECK LOGIN ================= */

router.get("/check",(req,res)=>{

const token = req.cookies.token

if(!token){
return res.status(401).json({loggedIn:false})
}

try{

const decoded = jwt.verify(token,process.env.JWT_SECRET)

res.json({
loggedIn:true,
user:decoded
})

}catch{

res.status(401).json({loggedIn:false})

}

})


router.post("/addjudge", isLoggedIn, async (req,res)=>{
  try{
if(!req.user.isRegistrer){
  return res.status(403).json({message:"Only admin can add judge"})
  }

  const {email,username,password} = req.body

  const existingUser = await User.findOne({username})

  if(existingUser){
  return res.status(400).json({message:"User already exists"})
  }

  const hashedPassword = await bcrypt.hash(password,10)

  const newJudge = new User({
  email,
  username,
  password:hashedPassword,
  isRegistrer:false,
  isJudge:true,
  isLawyer:false
  })

  await newJudge.save()

  res.json({message:"Judge added"})

  }catch(err){
  res.status(500).json({message:"Error adding judge"})
  }
  })

router.post("/addlawyer", isLoggedIn, async (req,res)=>{
try{
// 🔥 ROLE CHECK
if(!req.user.isRegistrer){
return res.status(403).json({message:"Only admin can add lawyer"})
}

const {email,username,password} = req.body

const existingUser = await User.findOne({username})

if(existingUser){
return res.status(400).json({message:"User already exists"})
}

const hashedPassword = await bcrypt.hash(password,10)

const newLawyer = new User({
email,
username,
password:hashedPassword,
isRegistrer:false,
isJudge:false,
isLawyer:true
})

await newLawyer.save()

res.json({message:"Lawyer added"})

}catch(err){

res.status(500).json({message:"Error adding lawyer"})

}

})
/* ================= LOGOUT ================= */

router.get("/logout",(req,res)=>{

res.clearCookie("token")

res.json({message:"Logged out"})

})

export default router