const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        //required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    rol:{
        type: String,
        enum: ['administrador', 'moderador', 'usuario'],
        default: 'usuario'
      },
    baneado:{
        type: Number,
        default: null

      }
},{
    timestamps:true
});

module.exports = userSchema;