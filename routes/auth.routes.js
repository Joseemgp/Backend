'use strict'
//const express = require('express');

const Users = require('../controllers/auth.controller.js');
const Comentarios = require('../controllers/comentarioController.js');

//const router = Router();


module.exports = (router) => { 
    router.post('/register', Users.createUser);
    router.get('/obtenerUsuarios', Users.obtenerUsuarios);
    router.put('/banearUsuario/:id', Users.banearUsuario);
    router.post('/login',Users.loginUser);
    router.put('/desbanearUsuario/:id', Users.desbanearUsuario);
    router.put('/cambiarContrasena/:email',Users.cambiarContrasena)
    router.put('/recuperarContrasena/:email',Users.recuperarContrasena)
    router.put('/recuperacion_y_cambio/:token',Users.Recuperacion_y_CambioContrasena)
    router.delete('/eliminarUsuario/:id', Users.eliminarUsuario);
}