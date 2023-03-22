'use strict'

const express =require('express');

const router=express.Router();
const comentarioController= require('../controllers/comentarioController');
//api/comentarios

router.get('/',comentarioController.obtenerComentarios);
router.get('/:id',comentarioController.obtenerComentarioId);
router.post('/crear',comentarioController.crearComentario);
router.put('/editar/:id',comentarioController.actualizarComentario);
router.delete('/eliminar/:id',comentarioController.borrarComentario);

module.exports=router;
