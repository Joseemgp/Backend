const mongoose =require('mongoose');
//import { ObjectId } from 'mongoose';
const authModel=require('../controllers/auth.controller.js');
const ComentarioSchema = mongoose.Schema({
       /* _id:{
            type: mongoose.Types.ObjectId
        },*/
        intensificacion:{
            type:String
        },
        optativa:{
            type:String
        },
        director_tfg:{
            type:String
        },
        muii:{
            type:String
        },
        estancia:{
            type:String
        },
        autor:{
            type:String,
            required:true
        },
        comentario:{
            type:String,
            required:true
        },

        puntuacion:{
            type:Number,
            required:true
        }
});

module.exports = mongoose.model('Comentarios',ComentarioSchema)