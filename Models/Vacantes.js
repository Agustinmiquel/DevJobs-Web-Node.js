const mongoose = require('mongoose'); //para tener todos los metodos para crear un nuevo modelo
mongoose.Promise = global.Promise; //Esto para que las respuestas de mongo sean Promesas
const slug = require('slug') // Para que nos genere las Url
const shortid = require('shortid'); //El SHORTID nos va a crear un ID unico a pesar de que las postulaciones sean las mismas.

const vacantesSchema= new mongoose.Schema({

    titulo: {
        type: String,
        required: 'el titulo es obligatorio',
        trim: true //trim lo que hace es recortar los espacios vacios en un titulo
    }, 

    empresa: {
        type: String,
        trim: true,
    },

    ubicacion:{
        type: String,
        trim: true,
    }, 

    salario: {
        type:String,
        default:0,
    }, 

    contrato: {
        type:String,
        trim:true,
    
    },

    descripcion: {
        type: String,
        trim: true,
    },

    url: {
        type:String,
        lowercase: true,
    },
    skills: [String],
    candidatos: [{
        nombre: String,
        email: String,
        cv: String,
    }],
});

vacantesSchema.pre('save', function(next){
    //crear la URL: 
    const url = slug(this.titulo); //solo va a modificarse el titulo en cada id
    this.url = `${url}-${shortid.generate()}`; //Para generar un ID unico para cada vacante, pasamos la const url y el shortid

    next(); //NEXT es un Middelware
})
module.exports = mongoose.model('Vacante', vacantesSchema); 