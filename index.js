'use strict'

const authRoutes = require('./routes/auth.routes')
const express = require('express');
const conectarDB =require('./config/db')
const cors = require('cors')
const path = require('path');

//Iniciar sesion


conectarDB();
//creamos servidor
const app = express();
app.use(express.json());
//iniciar sesion
const router = express.Router();
app.use('/api',router);
authRoutes(router);
app.set('port', process.env.PORT || 4000);
const port = app.get('port');
app.use(cors())



//conectamos a la base de datos

//


//
router.get('/',(req,res)=>{
  res.send('Hello from home');
})
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res) { res.sendFile(path.join(__dirname + '/public/index.html'));});
app.get('/login', function(req, res) { res.sendFile(path.join(__dirname + '/public/index.html'));});
app.get('/register', function(req, res) { res.sendFile(path.join(__dirname + '/public/index.html'));});
app.get('/menu', function(req, res) { res.sendFile(path.join(__dirname + '/public/index.html'));});
app.get('/intensificaciones', function(req, res) { res.sendFile(path.join(__dirname + '/public/index.html'));});
app.get('/leer-comentarios', function(req, res) { res.sendFile(path.join(__dirname + '/public/index.html'));});
app.get('/crear-comentario', function(req, res) { res.sendFile(path.join(__dirname + '/public/index.html'));});
app.get('/editar-comentario/:id', function(req, res) { res.sendFile(path.join(__dirname + '/public/index.html'));});
app.get('/optativas', function(req, res) { res.sendFile(path.join(__dirname + '/public/index.html'));});
app.get('/directores-tfg', function(req, res) { res.sendFile(path.join(__dirname + '/public/index.html'));});
app.get('/estancias', function(req, res) { res.sendFile(path.join(__dirname + '/public/index.html'));});
app.get('/usuarios', function(req, res) { res.sendFile(path.join(__dirname + '/public/index.html'));});
app.get('/contrasena', function(req, res) { res.sendFile(path.join(__dirname + '/public/index.html'));});
app.get('/recuperar-contrasena', function(req, res) { res.sendFile(path.join(__dirname + '/public/index.html'));});
app.get('/recuperacion_y_cambio/:token', function(req, res) { res.sendFile(path.join(__dirname + '/public/index.html'));});














app.use(router);

app.use('/api/comentarios',require('./routes/comentarios'))

//Ruta principal

app.listen(port);
console.log('Server on port', port);