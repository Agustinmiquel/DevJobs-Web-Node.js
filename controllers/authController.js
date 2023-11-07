const passport = require ('passport');
const mongoose = require('mongoose');
const { request, response } = require('express');
const Usuarios = require('../Models/Usuarios');
const Vacantes = mongoose.model('Vacante')
const crypto = require('crypto'); 
const enviarEmail = require('../handlers/email');


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
        imagen: req.user.imagen,
        vacantes
    });
}

exports.cerrarSesion = (req = request, res)=> {
    req.flash('correcto', 'Cerraste Sesíon');
    req.logOut();

    return res.redirect('iniciar-sesion');
}

// Formulario para Reestablecer la contraseña
exports.formReestablecerContra = (req, res) => {

    res.render('reestablecer-password',{
        nombrePagina: 'Reestablecer Contraseña',
        tagline: 'Si ya tienes cuenta, coloca tu email para cambiar de contraseña',
    });
}

// Generar el Token en la tabla del usuario
exports.enviarTOKEN = async (req, res) =>{

    const usuario = await Usuarios.findOne({email: req.body.email})

    if(!usuario){
        req.flash('error', 'No existe esa cuenta');
        return res.redirect('/iniciar-sesion');
    }

    // el usuario existe, generar token:
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expira = Date.now() + 3600000; 

    // Guardar el usuario:
    await usuario.save();
    const resetUrl = `http://${req.headers.host}/reestablecer-password/${usuario.token}`;

    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl, 
        archivo: 'reset'
    });

    // console.log(resetUrl);
    // Enviar notificacion por email:
    req.flash('correcto','Revisa tu email para seguir las indicaciones');
    res.redirect('/iniciar-sesion');
}

exports.reestablecerPassword = async (req, res) => {

    const usuario = await Usuarios.findOne({
        token: req.params.token,
        expira : {
            $gt : Date.now()
        }
    }); 

    if(!usuario){
        req.flash('error', 'El formulario ya expiro, intenta de nuevo');
        return res.redirect('/reestablecer-password');
    }

    // Todo bien, mostrar el formulario
    res.render('nuevo-password', {
        nombrePagina: 'Nueva contraseña',
    })

}

exports.guardarPassword = async (req, res, next) => {

    const usuario = await Usuarios.findOne({
        token: req.params.token,
        expira : {
            $gt : Date.now()
        }
    }); 

    if(!usuario){
        req.flash('error', 'El formulario ya expiro, intenta de nuevo');
        return res.redirect('/reestablecer-password');
    }

    // guardar en la BD y limpiar valores previos
    usuario.password = req.body.password; 
    usuario.token = undefined;
    usuario.expira = undefined;

    await usuario.save();
    req.flash('correcto','Contraseña modificada correctamente');
    res.redirect('/iniciar-sesion');
}