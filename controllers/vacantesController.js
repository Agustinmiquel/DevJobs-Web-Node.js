const req = require("express/lib/request");
const mongoose = require('mongoose')
const Vacante = mongoose.model('Vacante');

exports.formularioNuevavacante = (req, res) => {
    res.render('nueva-vacante', {
        nombrePagina: 'Nueva Vacante',
        cerrarSesion: true,
        nombre: req.user.nombre,
        tagline: 'Completa el formulario y publica tu vacante',
    }); 
}

exports.agregarVacante = async (req,res) => {
    const vacante = new Vacante(req.body); 

    //usuario autor de la vacante
    vacante.autor = req.user._id;

    //crear arreglo de habilidades: 
    vacante.skills = req.body.skills.split(',');

    //almacenarlo en la base de datos
    const nuevaVacante = await vacante.save();

    //redireccion
    res.redirect(`/vacantes/${nuevaVacante.url}`)
}

//mostrar vacante:
exports.mostrarVacante = async (req, res, next) =>{
    const vacante = await Vacante.findOne({url: req.params.url});

    //si no hay vacantes
    if(!vacante) return next();

    res.render('vacante', {
        vacante,
        nombrePagina:vacante.titulo,
        barra:true,
    })
}

//editarVacante: 
exports.formEditarVacante = async (req, res, next) =>{
 const vacante = await Vacante.findOne({ url: req.params.url }); 

 if(!vacante) return next(); 

    res.render('editar-vacante',{
    vacante,
    cerrarSesion: true,
    nombre: req.user.nombre,
    nombrePagina: `Editar-${vacante.titulo}`,
 })
}

exports.editarVacante = async (req, res) => {
    const vacanteActualizada = req.body; 
    vacanteActualizada.skills = req.body.skills.split(','); 

    const vacante = await Vacante.findOneAndUpdate({url: req.params.url}, vacanteActualizada,{
        new : true,
        runValidators: true,
    }); 

    res.redirect(`/vacantes/${vacante.url}`); 
}

exports.validarVacante = (req, res, next) => {

    // Sanitizar los campos
    req.sanitizeBody('titulo').escape();
    req.sanitizeBody('empresa').escape();
    req.sanitizeBody('ubicacion').escape();
    req.sanitizeBody('salario').escape();
    req.sanitizeBody('contrato').escape();
    req.sanitizeBody('skills').escape();

    // validar
    req.checkBody('titulo','Agrega un Titulo a la Vacante').notEmpty();
    req.checkBody('empresa','Nombre de la Empresa es requerido').notEmpty();
    req.checkBody('ubicacion','Ubicación es requerida').notEmpty();
    req.checkBody('contrato','Contrato es requerido').notEmpty();
    req.checkBody('skills', 'Agrega al menos una habilidad').notEmpty();

    const errores = req.validationErrors(); 
    
    if(errores){
        // Retorno si hay errores: 
        req.flash('error', errores.map(error => error.msg));
        
        res.render('nueva-vacante', {
            nombrePagina: 'Nueva Vacante',
            cerrarSesion: true,
            nombre: req.user.nombre,
            tagline: 'Completa el formulario y publica tu vacante',
            mensajes: req.flash()
        })
    }

    next();
}

exports.eliminarVacante = async (req, res) => {

    const { _id } = req.params; 

    const vacante = await Vacante.findById(_id); 

    if(verificarAutor(vacante, req.user)){
        //Si es el usuario y puede eliminar
        vacante.remove();
        res.status(200).send('Vacante Eliminada Correctamente');
    } else{
        res.status(403).send('Error')
    }

    console.log( _id ); 
 
}

const verificarAutor = ( vacante = {}, usuario = {}) => {
    if(!vacante.autor.equals(usuario._id)){
        return false
    }
    return true;
}
