const router = require("express").Router();
const mongoose = require('mongoose'); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/profile")



// Register user

router.post("/signup", async (req, res) => {
    const {fName, lName, email, password } = req.body;
  try {
        if(!fName || !lName || !email || !password){
            return res.status(422).json({ error: "Please fill all the field" });
        }
        let user = await User.findOne({ email:email });
        if (user) {
          return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        newUser = {
            fName,
            lName,
            email,
            password:hashedPassword,
         };
         const user1=new User(newUser);
         await user1.save();
             res
             .status(201)
             .send({ status: "User created successfully",user:user1 });

    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
  }
});





// login user

router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        res.status(422).json({error:"Please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            res.status(422).json({error:"Invalid email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                res.json({message:"Successfully signed in"})
            }
            else{
                return res.status(422).json({error:"Invalid email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})



module.exports = router