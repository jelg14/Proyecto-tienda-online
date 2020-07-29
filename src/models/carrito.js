'use strict'
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CarritoSchema = Schema({
    idProducto: { type: Schema.ObjectId, ref: 'producto' },
    cantidad: Number,
    descripcion: String,
    precio: Number,
    subtotal: Number,
    idUsuario: { type: Schema.ObjectId, ref: 'usuario' }
})

module.exports = mongoose.model('carrito', CarritoSchema)