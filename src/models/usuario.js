'use strict'

var mongoose = require("mongoose")
var Schema = mongoose.Schema

var UsuarioSchema = Schema({
    nombre: String,
    usuario: String,
    email: String,
    password: String,
    rol: String
})
module.exports = mongoose.model('usuario', UsuarioSchema)