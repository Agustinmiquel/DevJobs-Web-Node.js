const passport = require ('passport');
const mongoose = require('mongoose');
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
        vacantes
    });
}
