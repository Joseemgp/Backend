const mongoose =require('mongoose');
//import { ObjectId } from 'mongoose';
const authModel=require('../controllers/auth.controller.js');
const Correo_aplicacionSchema = mongoose.Schema({
       
        email:{
            type:String
        },
        password:{
            type:String}
        
});

module.exports = mongoose.model('Correo_aplicacions',Correo_aplicacionSchema)