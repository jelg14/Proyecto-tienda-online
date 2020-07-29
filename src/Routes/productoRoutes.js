'use strict'

var express = require("express")
var ProductoController = require('../controllers/productosController')
var md_auth = require('../middlewares/authenticated')

// RUTAS
var api = express.Router()
api.post('/agregar-producto', md_auth.ensureAuth, ProductoController.agregarProducto)
api.get('/listar-productos-categoria/:idCategoria', md_auth.ensureAuth, ProductoController.listarProductosCategoria)
api.get('/listar-productos', md_auth.ensureAuth, ProductoController.listarProductos)
api.get('/buscar-producto/:idProducto', md_auth.ensureAuth, ProductoController.listarProductoId)
api.put('/editar-producto/:idProducto', md_auth.ensureAuth, ProductoController.editarProducto)
api.delete('/eliminar-producto/:idProducto', md_auth.ensureAuth, ProductoController.eliminarProducto)
module.exports = api;