const express=require('express')
const app=express()
const db=require('./db')
const port=process.env.PORT || 2200
const cors=require('cors')
app.use(cors())

const AuthController=require('./controller/authController');
app.get('/',(req,res)=>{
    res.send('login')
})
app.use('/api/auth',AuthController);

app.listen(port,()=>{
    console.log(`server running on port ${port}`)
})
