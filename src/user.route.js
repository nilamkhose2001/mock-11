const express=require("express")
const User=require("./user.model")
const jwt=require("jsonwebtoken")
const app=express.Router()
const secret= process.env.SECRET_PASSWORD;
app.post("/signup",async(req,res)=>{
    const {email,password}=req.body
    const user=await User.findOne({ email });

    if (user) {
        return res
          .status(403)
          .send({ message: "user already exists,please login" });
      }

      await User.create({
        email,password
      })

      return res.status(201).send({
        message: "user created successfully",
        email,
        password,
      });
})

app.post("/login",async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      if (user.password !== password) {
        return res.status(403).send({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          _id: user._id,
          email:user.email,
          password:user.password
        },
        secret,
    { expiresIn: "7 days" }
      );
    
      return res.send({ message: "login successful", token });
})

module.exports =app