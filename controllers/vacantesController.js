const req = require("express/lib/request");
const mongoose = require('mongoose')
const Vacante = mongoose.model('Vacante');

exports.formularioNuevavacante = (req, res) => {
    res.render('nueva-vacante', {
        nombrePagina: 'Nueva Vacante',
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
