'use strict';

const  Model  = require('../mongo');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const schema =require('./schema');
let SECRET ='heeey';



class Users extends Model{
    constructor(){
        super(schema)
    }

    //method to save 
    async save (record){
let result = await this.get({username:record.username})
if(result.length === 0 ){
    record.password = await bcrypt.hash(record.password,5);
return await this.create(record);
}
return Promise.reject();

    }

//authenticate a user using the hashed password

async authenticateBasic(user,password){
let record = await this.get ({username:user});
if(record){
    await bcrypt.compare(password,record[0].password);
    return record[0];
}
return Promise.reject();
}

//generate a Token following a valid login
async generateToken(user){
let token = jwt.sign({username:user.username},SECRET);
return token;
}

}

module.exports = new Users;