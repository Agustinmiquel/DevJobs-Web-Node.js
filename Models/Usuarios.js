const mongoose = require('mongoose'); //para tener todos los metodos para crear un nuevo modelo
mongoose.Promise = global.Promise; //Esto para que las respuestas de mongo sean Promesas
const brcrypt = require('bcrypt')


const usuariosSchema= new mongoose.Schema({
    email: {
        type: String,
        unique:true,
        lowercase:true, //para que los correos sean en minuscula o se almacenan como tal
        trim: true 
    },

    nombre: {
        type: String,
    },
    password: {
        type: String,
    },
    token: String,
    expira: Date,
    imagen: String,
});

// METODO PARA HASHEAR LAS PASSWORDs
usuariosSchema.pre('save', async function(next){
    // Si el password esta hasheado, deten la ejecucion. 
    if(!this.isModified('password')){
        return next()
    }

    // si no está hashedado
    const hash = await brcrypt.hash(this.password, 11);
    this.password = hash; 
    next();
});

// AGREGAR INDICE PARA el Buscador:
usuariosSchema.index({nombre: 'text'})

//Envia una alerta en el caso de que el usuario ya este registrado
usuariosSchema.post('save', function(error, doc, next ){
    if(error.name === 'MongoServerError' && error.code === 11000){
        next('Ese correo ya esta registrado')
    } else{
        next(error)
    }
})

//Autenticar Usuario:
usuariosSchema.methods = {
    compararPassword: function(password){
        return brcrypt.compareSync(password, this.password);
}}

module.exports = mongoose.model('UsuariosSchema', usuariosSchema);