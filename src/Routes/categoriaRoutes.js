'use strict'
var express = require('express')
var CategoriaController = require('../controllers/categoriasController')
var md_auth = require('../middlewares/authenticated')

// RUTAS

var api = express.Router()
api.post('/agregar-categoria', md_auth.ensureAuth, CategoriaController.agregarCategoria)
api.post('/categoria-defecto', CategoriaController.categoriaPorDefecto)
api.get('/listar-categoria', md_auth.ensureAuth, CategoriaController.listarCategorias)
api.put('/editar-categoria/:idCategoria', md_auth.ensureAuth, CategoriaController.editarCategoria)
api.delete('/eliminar-categoria/:idCategoria', md_auth.ensureAuth, CategoriaController.eliminarCategoria)
module.exports = api