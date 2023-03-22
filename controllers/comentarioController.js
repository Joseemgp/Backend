const Comentario = require("../models/Comentarios");

exports.obtenerComentarios = async(req,res) =>{
    try{
        comentarios  = await Comentario.find();
        res.json(comentarios)
    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}
exports.obtenerComentarioId = async(req,res) =>{
    try{
        const comentario = await Comentario.findById(req.params.id);
        if(!comentario){
            res.status(404).json({msg:'No existe el comentario'});
        }
        res.json(comentario);
    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//crear comentario
exports.crearComentario = async(req,res) =>{   
    try{
        let comentario;
        comentario = new Comentario(req.body);

    


        
        await comentario.save();
        res.send(comentario);
    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}
exports.actualizarComentario = async(req,res) =>{
    try{
        const{ intensificacion, optativa, autor, comentario, puntuacion } = req.body;
        let Comentario_actualizado;
        Comentario_actualizado = await Comentario.findById(req.params.id);
        if(!Comentario_actualizado){
            res.status(404).json({msg:'No existe el comentario'});
        }
        Comentario_actualizado.intensificacion = intensificacion;
        Comentario_actualizado.optativa = optativa;
        Comentario_actualizado.autor = autor;
        Comentario_actualizado.comentario = comentario;
        Comentario_actualizado.puntuacion = puntuacion;
        Comentario_actualizado =await Comentario.findOneAndUpdate({_id:req.params.id},Comentario_actualizado,{new:true});
        res.json(Comentario_actualizado);
    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.borrarComentario = async(req,res) =>{
    try{
        let comentario;
        comentario = await Comentario.findById(req.params.id);
        if(!comentario){
            res.status(404).json({msg:'No existe el comentario'});
        }
        await Comentario.findOneAndRemove({_id:req.params.id});
        res.json({msg:'Comentario eliminado'});
    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}