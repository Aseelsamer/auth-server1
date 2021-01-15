'use strict';

const base64 = require('base-64');
const user = require('../models/user-models');

//Reads the encoded username and password from the
// Authentication header
//Checks the Users model to see if this is a valid 
//user and the right password
module.exports=(req,res,next)=>{
    if(!req.headers.authorization){
        next('invalid');
        return;
    }

    let authHeader= req.headers.authorization.split(" ");
    if(authHeader[0]!="Basic"){
        next('not found');
        return;
    }
    //If the user is valid, generate a token and append 
    //it to the request object
    //If valid, call next()
    //Otherwise, call next() with an error as an argument
    let basic=authHeader.pop();
    let [users,password] = base64.decode(basic).split(":");
    user.authenticateBasic(users,password).then(verified=>{
        req.user=verified;
        user.generateToken(verified).then(generatedToken=>{
            req.token=generatedToken;

            next()
        }).catch(err=>next('error in token'))
    }).catch(err=>next('invalid log in'));
}