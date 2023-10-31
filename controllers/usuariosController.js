const req = require("express/lib/request");
const Usuarios = require("../Models/Usuarios");
const mongoose = require('mongoose');
const passport = require ('passport')
const multer = require('multer'); 
const shortid = require('shortid');

exports.subirImagen = (req, res, next) => {
    upload(req, res, function(error) {
        if(error instanceof multer.MulterError ){
            return next()
        }
    });

    next();
}
// Opciones de config de Multer
const configMulter = {
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, next)=> {
            next(null, __dirname+'../../public/uploads/perfiles')
        }, 
        filename:(req,file,next)=>{
            // console.log(file);
            // Funcion para encryptar el nombre de la imagen.
            const extension = file.mimetype.split('/')[1];
            next(null, `${shortid.generate()}.${extension}`)
        }
    }
    )
}

const upload = multer(configMulter).single('imagen');



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

//Editar Perfil de usuario: 
exports.formEditarPerfil = (req, res, next) =>{
    res.render('editar-perfil',{
        nombrePagina: 'Editar Perfil',
        cerrarSesion: true,
        nombre: req.user.nombre,
        usuario: req.user
    })
}

exports.editarPerfil = async (req, res, next) => {

    const user = await Usuarios.findById(req.user._id)
    user.nombre = req.body.nombre;
    user.email = req.body.email;

    if(req.user.password){
        user.password = req.user.password;
    }

    await user.save();
    req.flash('correcto', 'Cambios guardados correctamente');

    //redirect
    res.redirect('/administracion');
}

exports.validarPerfil = (req, res, next) => {
    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('email').escape();

    if(req.body.password){
        req.sanitizeBody('password').escape();
    }

    req.checkBody('nombre', 'El nombre esta vacio').notEmpty();
    req.checkBody('email', 'El email esta vacio').notEmpty();

    const errores = req.validationErrors();

    if(errores){
        req.flash('error', errores.map(error => error.msg));
        
        res.render('editar-perfil',{
            nombrePagina: 'Editar Perfil',
            cerrarSesion: true,
            nombre: req.user.nombre,
            usuario: req.user,
            mensajes: req.flash(),
        })
    }
    
    next();
}