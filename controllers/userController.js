const User = require('../models/userModal')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')

const securePassword = async(password)=>{
    try {
      const passwordHash =  await bcrypt.hash(password,10);
         return passwordHash;
    } catch (error) {
        console.log(error.message)
    }
}
//for send mail
const sendVerifymail =async(name,email,user_id)=>{
   try {
    const transporter =  nodemailer.createTransport({
        // host:'smtp.gmail.com',
        // port:587,
        // secure:false,
        // requireTLS:true,
        // auth:{
        //     user:'amitcdac98@gmail.com',
        //     pass:"9755991536"
        // }
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "25c3138bdc2320",
          pass: "44eb0d8a45423e"
        }
      })
      const mailOptions={
        from:'amitcdac98@gmail.com',
        to:email,
        subject:'For verification mail',
        html:'<p>Hii '+name+',please click to <a href="http://127.0.0.1:3000/verify?id='+user_id+'">Varify </a> your mail </p>'
      }
      transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error)
        }
        else{
            console.log(info)
            console.log("Email has been sent:+",info.response)
        }
      })
   } catch (error) {
     console.log(error.message)
   }
}
const loadRegister = async (req,res)=>{
    try {
        res.render('registration')
    } catch (error) {
        console.log((error.message))
    }
}

const insertUser =async(req,res)=>{
    try {
        const spassword = await securePassword(req.body.password)
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mobile,
            image:req.file.filename,
            password:spassword,
            is_admin :0
        })
       const userData = await user.save();
       if(userData){
         sendVerifymail(req.body.name,req.body.email,userData._id);
        res.render('registration',{message:"your registration has been successfully,please verify your mail"})
       }else{
        res.render('registration',{message:"your registration has been failed"})
       }
    } catch (error) {
        console.log(error.message)
    }
}

const verifyMail = async(req,res)=>{
    try{
      const updateInfo = await User.updateOne({_id:req.query.id},{$set:{is_varified:1}})
      console.log(updateInfo);
      res.render('email-verified')
    }catch(error){
        console.log(error)
    }
}
///login user mehods started--

const loginLoad = async(req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message)
    }
}
module.exports = {
    loadRegister,insertUser,verifyMail,loginLoad
}