'use strict'

var express = require("express")
var UsuarioController = require("../controllers/usuarioControllers")
var md_auth = require('../middlewares/authenticated')

//RUTAS TRAZADAS

var api = express.Router()
api.post('/registrar', UsuarioController.registrarUsuario)
api.post('/registrar-administrador', UsuarioController.registrarAdministrador)
api.get('/login', UsuarioController.login)
api.put('/editar-usuario/:isUsuario', md_auth.ensureAuth, UsuarioController.editarUsuario)
api.delete('/eliminar-usuario/:isUsuario', md_auth.ensureAuth, UsuarioController.eliminarUsuario)
api.get('/producto-mas-vendido/', md_auth.ensureAuth, UsuarioController.productoMasVendido)
api.get('/busqueda-producto-nombre', md_auth.ensureAuth, UsuarioController.busquedaProductoNombre)
api.put('/agregar-carrito', md_auth.ensureAuth, UsuarioController.agregarAlCarrito)
api.get('/ver-factura/:idUsuario', md_auth.ensureAuth, UsuarioController.VerFactura)
api.get('/producto-agotado', md_auth.ensureAuth, UsuarioController.ProductoAgotado)
api.get('/stock-productos', md_auth.ensureAuth, UsuarioController.controlStock)
api.post('/crear-carrito', md_auth.ensureAuth, UsuarioController.crearCarrito)
module.exports = api;