'use strict';

const express = require('express');
const router = express.Router();
const user = require('../auth/models/user-models');
const authenticateBasic = require('../auth/middleware/basic');




//Create a POST route for /signup
//Accepts either a JSON object or FORM Data with the keys
// “username” and “password”
//Creates a new user record in a Mongo database

router.post('/signup',(req,res,next)=>{
user.save(req.body)
.then(users=>{
    user.generateToken(users).then(result=>{
        //adding header
        res.status(200).send(result);
    }).catch(err=>next('invalid'))
}).catch(err=>res.status(403).send('creation error'))
});

router.post('/signin',authenticateBasic,(req,res)=>{
    res.set('auth',req.token);
    res.cookie('token',req.token);
    res.status(200).send({token:req.token,user:req.user});
});

router.get('/users',authenticateBasic,(req,res)=>{
    user.get().then((result)=>{
        res.json({results:result})
    });
});

module.exports=router;