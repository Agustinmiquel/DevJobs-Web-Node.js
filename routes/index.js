// Aca en este express, vamos a tener los routers.
const express = require('express'); 
const route = express.Router();
const homeController = require('../controllers/homeController');
const vacantesController = require('../controllers/vacantesController');
const usuariosController = require('../controllers/usuariosController');

module.exports = () => {
    route.get('/', homeController.mostrarTrabajos)

    //Crear Vacantes: 
    route.get('/vacantes/nueva',vacantesController.formularioNuevavacante);

    //Agregar vacante: 
    route.post('/vacantes/nueva', vacantesController.agregarVacante);

    //Mostrar vacante:
    route.get('/vacantes/:url',vacantesController.mostrarVacante);

    //editar vacante: 
    route.get('/vacantes/editar/:url',vacantesController.formEditarVacante);
    route.post('/vacantes/editar/:url', vacantesController.editarVacante); 

    //Crear cuentas: 
    route.get('/crear-cuenta',usuariosController.formCrearCuenta);

    return route;
}