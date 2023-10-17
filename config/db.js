// Todo lo relacionado a la base de datos, va a ir aca:
const mongoose = require('mongoose');
require('dotenv').config({path: 'variables.env'});

// La conexion lleva dos parametros: la URL y las opciones
mongoose.connect(process.env.DATABASE, {useNewUrlParser:true});

mongoose.connection.on('error', (error) =>{
    console.log(error)
})

//IMPORTAR LOS MODELOS: 
require('../Models/Vacantes');
require('../Models/Usuarios');