'use strict'

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var FacturaSchema = Schema({
    serieFactura: String,
    NumeroFactura: Number,
    nombre: String,
    nit: String,
    descripcion: [

    ],
    total: Number,
    usuarioId: { type: Schema.ObjectId, ref: 'usuario' }

})

module.exports = mongoose.model('factura', FacturaSchema)