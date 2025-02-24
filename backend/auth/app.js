//register backend 



import express from 'express';
import bcrypt from 'bcrypt';

const app=express();// create express app
const port=3000;// port to listen on

const users=[];// create a users array ya3ni a list of users


app.use(express.json());// middleware to parse json data ya3ni to convert json data to js object


app.post('/register',async(req,res)=>{
    try{
        const {email,password}=req.body;// get email and password from the request body
        const findUser=users.find((data)=>email === data.email);// check if the user already exists
        if(findUser){
             res.status(400).send({message:'email ou mot de passe incorrect!'});// if user exists return status 400 and a message
        }
        //hash password
        const hashedPassword=await bcrypt.hash(password,10);// hash the password w l await besh kyf ykamal yaaml execution yaaty reponse
        users.push({email,password:hashedPassword});// if user does not exist push the user to the users array
        res.status(201).send({message:'User created successfully!'});// return status 201 and a message w l 201 ya3ni created was successfully


    }catch(err){
        res.status(500).send({message:err.message});// if there is an error send status 500 and the error message
    }
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
});// listen on port 3000