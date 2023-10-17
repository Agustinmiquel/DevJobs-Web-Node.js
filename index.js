const mongoose = require('mongoose');
require('./config/db');

const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const router = require('./routes')
const path = require('path');
const exphbs = require('express-handlebars')
const cookie = require('cookie-parser')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyparser = require('body-parser'); 
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const expressValidator = require('express-validator'); 
const flash = require('connect-flash');

const passport = require('./config/passport')



require('dotenv').config({path: 'variables.env'});

const app = express(); 

//Habilitar bodyparser: 
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

//Habilitar expressValidator y ConnectFlash:
app.use(expressValidator());

// Habilitar Handlebars como view:
app.engine('handlebars', 
    exphbs.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'layout',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    helpers: require('./helpers/handlebars')
    })
);
app.set('view engine', 'handlebars');

//static files:
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookie());
app.use(session({
    secret:process.env.SECRETO,
    key:process.env.KEY,
    resave:false,
    saveUninitialized:false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}));

//Inicializar el PASSPORT: 
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Nuestros Middlewares: 
app.use((req,res,next) => {
    res.locals.mensajes = req.flash(); 
    next();
});

app.use('/',router());

app.listen(process.env.PUERTO);