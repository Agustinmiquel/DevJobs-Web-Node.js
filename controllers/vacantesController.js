const req = require("express/lib/request");
const mongoose = require('mongoose')
const Vacante = mongoose.model('Vacante');

const multer = require('multer');
const shortid = require('shortid');

exports.formularioNuevavacante = (req, res) => {
    res.render('nueva-vacante', {
        nombrePagina: 'Nueva Vacante',
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        tagline: 'Completa el formulario y publica tu vacante',
    }); 
}

exports.agregarVacante = async (req,res) => {
    const vacante = new Vacante(req.body); 

    //usuario autor de la vacante
    vacante.autor = req.user._id;

    //crear arreglo de habilidades: 
    vacante.skills = req.body.skills.split(',');

    //almacenarlo en la base de datos
    const nuevaVacante = await vacante.save();

    //redireccion
    res.redirect(`/vacantes/${nuevaVacante.url}`)
}

//mostrar vacante:
exports.mostrarVacante = async (req, res, next) =>{
    const vacante = await Vacante.findOne({url: req.params.url}).populate('autor');

    console.log(vacante);

    //si no hay vacantes
    if(!vacante) return next();

    res.render('vacante', {
        vacante,
        nombrePagina:vacante.titulo,
        barra:true,
    })
}

//editarVacante: 
exports.formEditarVacante = async (req, res, next) =>{
 const vacante = await Vacante.findOne({ url: req.params.url }); 

 if(!vacante) return next(); 

    res.render('editar-vacante',{
    vacante,
    cerrarSesion: true,
    nombre: req.user.nombre,
    imagen: req.user.imagen,
    nombrePagina: `Editar-${vacante.titulo}`,
 })
}

exports.editarVacante = async (req, res) => {
    const vacanteActualizada = req.body; 
    vacanteActualizada.skills = req.body.skills.split(','); 

    const vacante = await Vacante.findOneAndUpdate({url: req.params.url}, vacanteActualizada,{
        new : true,
        runValidators: true,
    }); 

    res.redirect(`/vacantes/${vacante.url}`); 
}

exports.validarVacante = (req, res, next) => {

    // Sanitizar los campos
    req.sanitizeBody('titulo').escape();
    req.sanitizeBody('empresa').escape();
    req.sanitizeBody('ubicacion').escape();
    req.sanitizeBody('salario').escape();
    req.sanitizeBody('contrato').escape();
    req.sanitizeBody('skills').escape();

    // validar
    req.checkBody('titulo','Agrega un Titulo a la Vacante').notEmpty();
    req.checkBody('empresa','Nombre de la Empresa es requerido').notEmpty();
    req.checkBody('ubicacion','Ubicación es requerida').notEmpty();
    req.checkBody('contrato','Contrato es requerido').notEmpty();
    req.checkBody('skills', 'Agrega al menos una habilidad').notEmpty();

    const errores = req.validationErrors(); 
    
    if(errores){
        // Retorno si hay errores: 
        req.flash('error', errores.map(error => error.msg));
        
        res.render('nueva-vacante', {
            nombrePagina: 'Nueva Vacante',
            cerrarSesion: true,
            nombre: req.user.nombre,
            tagline: 'Completa el formulario y publica tu vacante',
            mensajes: req.flash()
        })
    }

    next();
}

exports.eliminarVacante = async (req, res) => {

    const { id } = req.params; 

    const vacante = await Vacante.findById(id); 

    if(verificarAutor(vacante, req.user)){
        //Si es el usuario y puede eliminar
        vacante.remove();
        res.status(200).send('Vacante Eliminada Correctamente');
    } else{
        res.status(403).send('Error')
    }

    console.log( _id ); 
 
}

const verificarAutor = ( vacante = {}, usuario = {}) => {
    if(!vacante.autor.equals(usuario._id)){
        return false
    }
    return true;
}

// SUBIR CV con PDF:

exports.subirCV = (req, res, next) => {
    upload(req, res, function(error) {
        if(error){
            if(error instanceof multer.MulterError ){
                if(error.code === 'LIMIT_FILE_SIZE'){
                    req.flash('error', 'El archivo es muy grande: Máximo 100kb');
                } else{
                    req.flash('error', error.message);
                }
            } else{
                req.flash('error', error.message) //error de carga de archivo
            }
            res.redirect('back');
            return;
        } else{
            return next();
        }
    });
}

// Configuracion de Multer: 
const configMulter = {
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb)=> {
            cb(null, __dirname+'../../public/uploads/cv')
        }, 
        filename:(req,file,cb)=>{
            // console.log(file);
            // Funcion para encryptar el nombre de la imagen.
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`)
        }
    }), 
    fileFilter(req,file, cb){
        if(file.mimetype === 'application/pdf'){
            // El callback se ejecuta como TRUE si la imagen es correcta:
            cb(null, true);
        } else{
            cb(new Error('El formato no es valido'), false);
        }
    }, 
    limits : { fileSize : 100000 } //para limitar el tamaño de las imagenes (100kb)
}

const upload = multer(configMulter).single('cv');


exports.contactar = async(req, res, next) => {
    // console.log(req.params.url);
    // almacenar las vacanes en la BD
    const vacante = await Vacante.findOne({url : req.params.url});

    // si no existe la vacante
    if(!vacante){
        return next
    }
    const nuevoCandidato = {
        nombre: req.body.nombre,
        email : req.body.email,
        cv : req.file.filename
    }

    // almacenar la vacante:
    vacante.candidatos.push(nuevoCandidato);
    await vacante.save()

    // mensaje de confirmacion:
    req.flash('correcto', 'Se envio el curriculum correctamente');
    res.redirect('/');
}

exports.mostrarCandidatos = async (req, res, next) => {
    // console.log(req.params.id);

    const vacante = await Vacante.findById(req.params.id)

   if(!vacante.autor == req.user._id.toString()){
        return next();
    }

    if(!vacante) return next();

    res.render('candidatos', {
        nombrePagina: `Candidatos Vacante - ${vacante.titulo}`,
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        candidatos: vacante.candidatos
    })
   
}

exports.buscarVacantes = async (req, res) => {

    const vacantes = await Vacante.find({
        $text: {
            $search: req.body.q
        }
    });

    res.render('home', {
        nombrePagina: `Resultados para la busqueda de : ${req.body.q}`,
        barra:true,
        vacantes,
        boton:true
    })
}