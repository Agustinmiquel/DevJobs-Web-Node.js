const req = require("express/lib/request");
const Usuarios = require("../Models/Usuarios");
const mongoose = require('mongoose');
const passport = require ('passport')

exports.formCrearCuenta = (req, res) =>{
    res.render('crear-cuenta',{
        nombrePagina: 'Crea tu cuenta gratis en DevJobs',
        tagline: 'Comienza a publicar tus vacantes con un solo click',
    })
}

exports.validatorUsuario = (req,res, next) => {

    //sanitizar los campos: 
    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('email').escape();
    req.sanitizeBody('password').escape();
    req.sanitizeBody('confirmar').escape();

   //validar
    req.checkBody('email', 'El email debe ser valido').isEmail();
    req.checkBody('nombre', 'El nombre es obligatorio').notEmpty();
    req.checkBody('password', 'Debe introducir contraseña').notEmpty();
    req.checkBody('confirmar', 'Tiene que confirmar su contraseña').notEmpty();
    req.checkBody('confirmar', 'El password es diferente').equals(req.body.password);

    const errores = req.validationErrors();
    
    if (errores) {
        //si hay errores
        req.flash('error', errores.map(error => error.msg)); 

        res.render('crear-cuenta',{
            nombrePagina: 'Crea tu cuenta gratis en DevJobs',
            tagline: 'Comienza a publicar tus vacantes con un solo click',
            mensajes: req.flash(),

        });
        return;
    }

    //Si la validacion es correcta:
    next();
}

exports.crearUsuario = async (req, res, next) =>{

    //crear usuario
    const usuario = new Usuarios(req.body)

    try {
        await usuario.save()
        res.redirect('/iniciar-sesion'); 
    } catch (error) {
        req.flash('error', error);
        res.redirect('/crear-cuenta');
    }
    
    // console.log(usuario)
}

exports.formIniciarSesion = async (req, res) =>{
    res.render('iniciar-sesion',{
        nombrePagina: 'Inicia sesión en DevJobs',
    })

}