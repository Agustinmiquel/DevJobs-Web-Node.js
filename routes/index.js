// Aca en este express, vamos a tener los routers.
const express = require('express'); 
const route = express.Router();
const homeController = require('../controllers/homeController');
const vacantesController = require('../controllers/vacantesController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = () => {
    route.get('/', homeController.mostrarTrabajos)

    //Crear Vacantes: 
    route.get('/vacantes/nueva',
    authController.verificarUsuario,
    vacantesController.formularioNuevavacante
    );

    //Agregar vacante: 
    route.post('/vacantes/nueva',
    authController.verificarUsuario,
    vacantesController.validarVacante,
    vacantesController.agregarVacante,
    );

    //Mostrar vacante:
    route.get('/vacantes/:url',vacantesController.mostrarVacante);

    //editar vacante: 
    route.get('/vacantes/editar/:url',
    authController.verificarUsuario,
    vacantesController.formEditarVacante);

    route.post('/vacantes/editar/:url',
    authController.verificarUsuario,
    vacantesController.validarVacante,
    vacantesController.editarVacante); 

    //Crear cuentas: 
    route.get('/crear-cuenta',usuariosController.formCrearCuenta);
    route.post('/crear-cuenta',
    usuariosController.validatorUsuario, 
    usuariosController.crearUsuario);

    // Eliminar Vacantes: 
    route.delete('/vacantes/eliminar/:id',
        vacantesController.eliminarVacante,
    )

    //Autenticar Usuarios:
    route.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    route.post('/iniciar-sesion', authController.autenticarUsuario);

    // Cerrar Sesión:
    route.get('/cerrar-sesion',
    authController.verificarUsuario,
    authController.cerrarSesion,
    )

    //Panel de Administracion:
    route.get('/administracion',
    authController.verificarUsuario,
    authController.mostarPanel);

    //Editar perfil
    route.get('/editar-perfil',
    authController.verificarUsuario,
    usuariosController.formEditarPerfil);
    
    route.post('/editar-perfil',
    // usuariosController.validarPerfil,
    usuariosController.subirImagen,
    usuariosController.editarPerfil);

    return route;
}