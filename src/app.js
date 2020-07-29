'use strict'

//VARIABLES GLOBALES   
const express = require("express")
const app = express()
const bodyparser = require("body-parser")

// CARGAR RUTAS
var usuario_routes = require('./Routes/usuarioRoutes')
var producto_routes = require('./Routes/productoRoutes')
var categoria_routes = require('./Routes/categoriaRoutes')
var factura_routes = require('./Routes/facturaRoutes')

//MIDDLEWARES  
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json());

//CABECERAS (Peticiones HTTP)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')

    next();
})

// EXPORTAR RUTAS

app.use('/api', usuario_routes)
app.use('/api', producto_routes)
app.use('/api', categoria_routes)
app.use('/api', factura_routes)
module.exports = app;