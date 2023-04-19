const User=require('../auth/auth.dao.js');
const Comentario = require("../models/Comentarios");
const Correo_aplicacion=require('../models/Correo_aplicacion.js');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const { response } = require('express');
const { findById } = require('../auth/auth.dao.js');
//const SECRET_KEY= 'secretkey123456';
const generatePassword = () => {
  const length = 10;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
}
const nodemailer = require('nodemailer');
require('dotenv').config()

exports.createUser = (req, res, next) => {
    // Comprueba si el correo electrónico tiene el dominio @alu.uclm.es
    if (!req.body.email.endsWith('@alu.uclm.es')) {
      return res.status(410).send({message:'Solo se permiten correos electrónicos con dominio @alu.uclm.es'});
    }
     let password_desencriptada = generatePassword();
     const emailseparado = req.body.email.split('.');
    const newUser = {
      name: emailseparado[0],
      email: req.body.email,
      password: bcrypt.hashSync(password_desencriptada),
      rol: req.body.rol || 'usuario'
    };
  
   User.create(newUser, async (err, user) => {
          if (err && err.code == 11000) return res.status(409).send({message:'El correo electrónico ya está registrado'});
          if (err) return res.status(500).send('Error del servidor');
          let correoAplicacion = await Correo_aplicacion.findOne({})
      console.log(correoAplicacion.email);
      console.log(correoAplicacion.password);
          const transporter = nodemailer.createTransport({
            service:"Outlook365",
            host:"smpt.office365.com",
            secureConnection: false,
            port:587,
            auth: {
              user:correoAplicacion.email,
              pass:correoAplicacion.password
            },
            tls: {
              ciphers:'SSLv3',
              rejectUnauthorized: false,
            }
          });

         

          const mailOptions = {
            from: 'opinaesiiab@outlook.com',
            to: user.email,
            subject: 'Bienvenido a nuestro sitio',
            text: `Hola ${user.name}, \n\n Tu cuenta ha sido creada con éxito. Tu contraseña es ${password_desencriptada}. Por favor, accede a tu cuenta en nuestro sitio web y cambia tu contraseña lo antes posible. \n\n Gracias!`
          };

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email enviado: ' + info.response);
            }
          });

          // Generate access token and send response
          // const expiresIn = 24 * 60 * 60;
          // const accessToken = jwt.sign({
          //   email: user.email
          // }, SECRET_KEY, {
          //   expiresIn: expiresIn
          // });

          const dataUser = {
            name: user.name,
            email: user.email,
            rol: user.rol,
            //accessToken: accessToken,
            //expiresIn: expiresIn
          }

          res.send({
            dataUser
          });
        });
  }

exports.loginUser=(req,res,next) =>{
        const userData ={
            email:req.body.email,
            password:req.body.password,
            //rol:req.body.rol
        }
        User.findOne({
            email:userData.email
        },(err,user)=>{
            if(err) return res.status(500).send('Server error!');
            if(!user){
                //email no existe
                res.status(409).send({message:"Usuario o contraseña incorrectos"})

            }else {
                  
              const resultPassword= bcrypt.compareSync(userData.password,user.password);
              if(resultPassword){
                    if(Date.now() > user.baneado || user.baneado==null){
                    
                    //const expiresIn=24*60*60;
                    //const accessToken=jwt.sign({email:user.email},SECRET_KEY,{expiresIn:expiresIn});
                    const dataUser= {
                        name: user.name,
                        email: user.email,
                        rol: user.rol,
                        //accessToken: accessToken,
                        //expiresIn: expiresIn
                    }
                    res.send({dataUser});
                }else{
                    res.status(410).send({message:"usuario baneado"})
                }}else{
                    //contraseña incorrecta
                    res.status(411).send({message:"Usuario o contraseña incorrectos"})
                }
            }
        })
}


exports.cambiarContrasena = async (req, res, next) => {
    try {
      let user = await User.findOne({email:req.params.email});
      if (!user) {
        //email no existe
        return res.status(409).send({ message: "email incorrecto" });
      }
      if (Date.now() < user.baneado || user.baneado ==! null) {
        return res.status(410).send({ message: "usuario baneado" });
      }
      
      let resultPassword = bcrypt.compareSync(req.body.password, user.password);
      if (!resultPassword) {
        return res.status(411).send({ message: "contraseña actual incorrecta" });
      }
      user.password = bcrypt.hashSync(req.body.newPassword);
      await user.save();
      //res.status(200).send({ message: "Contraseña cambiada correctamente" });
      res.json(user)
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error!");
    }
  };

  exports.recuperarContrasena = async (req, res, next) => {
    try {
      
      let user = await User.findOne({email:req.body.email});
      if (!user) {
        // El email no está registrado
        return res.status(404).send({ message: "El email no está registrado" });
      }
      
      
      let correoAplicacion = await Correo_aplicacion.findOne({})
      await user.save();
      const token = jwt.sign(
        { user_email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
  
      // Enviamos un email al usuario con la nueva contraseña
      const transporter = nodemailer.createTransport({
        service:"Outlook365",
        host:"smpt.office365.com",
        secureConnection: false,
        port:587,
        auth: {
          user:correoAplicacion.email,
          pass:correoAplicacion.password
        },
        tls: {
          ciphers:'SSLv3',
          rejectUnauthorized: false,
        }
      });
      const resetUrl = `http://localhost:4200/recuperacion_y_cambio/${token}`;
      const message = `Para cambiar tu contraseña, sigue este enlace: ${resetUrl}`;
      await transporter.sendMail({
        from: "opinaesiiab@outlook.com",
        to: user.email,
        subject: "Recuperación de contraseña",
        text: message,
      });
      
  
      res.status(200).send({ message: "Se ha enviado la contraseña al email indicado" });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error del servidor");
    }
  };

exports.Recuperacion_y_CambioContrasena = async (req, res, next) => {
  try {
    let { token } = req.params;
    if (!token) {
      return res.status(400).send({ message: "No puedes acceder a esta página" });
    }
    let { user_email } = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar que el usuario existe en la base de datos
    let user = await User.findOne({email:user_email});
  

    // Obtener la nueva contraseña del body
  
    let resultPassword = bcrypt.compareSync(req.body.newPassword, user.password);
    if (resultPassword) {
      return res.status(411).send({ message: "La contraseña no puede ser igual a la que tenias antes" });
    }
  

    // Actualizar la contraseña del usuario
    user.password = bcrypt.hashSync(req.body.newPassword);
    await user.save();

    // Enviar un correo electrónico de confirmación de cambio de contraseña
    let correoAplicacion = await Correo_aplicacion.findOne({})
    const transporter = nodemailer.createTransport({
      service: "Outlook365",
      host: "smpt.office365.com",
      secureConnection: false,
      port: 587,
      auth: {
        user: correoAplicacion.email,
        pass: correoAplicacion.password
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
      }
    });
    const message = "Tu contraseña ha sido cambiada exitosamente";
    await transporter.sendMail({
      from: "opinaesiiab@outlook.com",
      to: user.email,
      subject: "Cambio de contraseña",
      text: message,
    });

    res.status(200).send({ message: "La contraseña ha sido cambiada exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error del servidor");
  }
};

exports.obtenerUsuarios = async(req,res) =>{
    try{
        usuarios  = await User.find();
        res.json(usuarios)
    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}
exports.banearUsuario = async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        user.baneado =Date.now()+1210000000; //esos son los milisegundos en 2 semanas
        user = await User.findOneAndUpdate({_id:req.params.id},user,{new:true});
        res.json(user);

        

    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error");
    }
}; 
exports.desbanearUsuario = async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        if (!user) {
          return res.status(404).send("Usuario no encontrado");
        }
    
        user.baneado = null;
        user =await User.findOneAndUpdate({_id:req.params.id},user,{new:true});
        
        res.json(user);
    
        
      } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error");
      }
    };

exports.eliminarUsuario = async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }
        //let comentarios= await Comentario.find({autor:user.email});

        await Comentario.deleteMany({autor:user.email});
        await User.findOneAndRemove({_id:req.params.id});
        

        res.json({msg:"Usuario eliminado"});

    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error");
    }
}

  






