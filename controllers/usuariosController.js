const req = require("express/lib/request");

exports.formCrearCuenta = (req, res) =>{
    res.render('crear-cuenta',{
        nombrePagina: 'Crea tu cuenta gratis en DevJobs',
        tagline: 'Comienza a publicar tus vacantes con un solo click',
    })
}