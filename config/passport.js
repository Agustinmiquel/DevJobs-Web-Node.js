const passport = require('passport')
const Local = require('passport-local').Strategy;
const mongoose = require('mongoose'); 
const Usuarios = require('../Models/Usuarios') 

passport.use(new Local({  
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) =>{
    const usuario = await Usuarios.findOne({email}); 
    if(!usuario) return done(null, false, {
        message: 'Usuario no Existente'
    })

    //el usuario existe pero el password es incorrecto
    const Verificarpass = usuario.compararPassword(password);
      if (!Verificarpass) {
        return done(null, false, {
          message: 'Contraseña incorrecta'
        })
      }

    //Usuario existe y el password es correcto
    return done(null, usuario);
}))

passport.serializeUser((usuario, done) => done(null, usuario._id));

passport.deserializeUser(async (id, done) => {
    const usuario = await Usuarios.findById(id);
    return done(null, usuario)
});

module.exports = passport;