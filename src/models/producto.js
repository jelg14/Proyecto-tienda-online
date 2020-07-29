'use strict'

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var ProductoSchema = Schema({
    nombreProducto: String,
    descripcion: String,
    cantidadDisponible: Number,
    precio: Number,
    numeroDeVentas: Number,
    categoriaId: { type: Schema.ObjectId, ref: 'categoria' }
})

module.exports = mongoose.model('producto', ProductoSchema)