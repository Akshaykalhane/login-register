const express=require('express')
const router=express.Router();
const bodyParser=require('body-parser');
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const config=require('../config')
const User=require('../model/userSchema')

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json())

//get all users

router.get('/users',(req,res)=>{
    User.find({},(err,data)=>{
        if(err) throw err;
        res.send(data)
    })
})

//register
router.post('/register',(req,res)=>{
    // encrypt password
    let hashPassword=bcrypt.hashSync(req.body.password,8);
    User.create({
        name:req.body.name,
        email:req.body.email,
        password: hashPassword,
        phone:req.body.phone,
        role:req.body.role?req.body.role:'User'
    },(err,data)=>{
        if(err) return res.status(500).send('Erro while register')
        res.status(200).send('Registration successfully')
    })
})

//login
router.post('/login',(req,res) => {
    User.findOne({email:req.body.email},(err,user) => {
        if(err) return res.status(500).send({auth:false,token:'Error while login'})
        if(!user) return res.status(200).send({auth:false,token:'No User Found Register First'})
        else{
            const passIsValid = bcrypt.compareSync(req.body.password,user.password)
            if(!passIsValid) return res.status(200).send({auth:false,token:'Invalid Password'})
            // in case email and password match generate token
            let token = jwt.sign({id:user._id},config.secret,{expiresIn:86400}) //24hr
            res.status(200).send({auth:true,token:token})
        }
    })
})

module.exports=router