'use strict'
var express = require('express')
var FacturaController = require('../controllers/facturasControllers')
var md_auth = require('../middlewares/authenticated')

//RUTAS
var api = express.Router()
api.post('/crear-factura', md_auth.ensureAuth, FacturaController.crearFactura)
api.put('/agregar-descripcion/:idFactura', md_auth.ensureAuth, FacturaController.agregarDescripcion)
module.exports = api