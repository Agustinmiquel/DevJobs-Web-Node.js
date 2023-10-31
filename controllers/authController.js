const passport = require ('passport');
const mongoose = require('mongoose');
const { request, response } = require('express');
const Vacantes = mongoose.model('Vacante')


exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect: '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios',
});

// Verificar un Usuario
exports.verificarUsuario = (req, res, next) => {
    if(req.isAuthenticated()){
        return next(); //estan autenticados
    };

    //redireccionar
    res.redirect('/iniciar-sesion')
}

exports.mostarPanel = async (req, res) => {

    //consultar el usuario autenticado: 
    const vacantes = await Vacantes.find({autor: req.user._id})

    res.render('administracion',{
        nombrePagina: 'Panel de Administracion',
        tagline: 'Crea y administra tus vacantes desde aqui',
        cerrarSesion: true,
        nombre: req.user.nombre,
        vacantes
    });
}

exports.cerrarSesion = (req = request, res)=> {
    req.flash('correcto', 'Cerraste Sesíon');
    req.logOut();

    return res.redirect('iniciar-sesion');
}
