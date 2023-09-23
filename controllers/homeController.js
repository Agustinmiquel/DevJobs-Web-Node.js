const mongoose = require('mongoose')
const Vacante = mongoose.model('Vacante');
const req = require("express/lib/request");


exports.mostrarTrabajos = async (req,res,next) => {

    const vacantes = await Vacante.find(); 

    if(!vacantes) return next();

    res.render('home', {
        nombrePagina: 'devJobs',
        tagline: 'Encuentra y publica Trabajos para desarrolladores web',
        barra: true,
        boton:true, 
        vacantes,
    })
}