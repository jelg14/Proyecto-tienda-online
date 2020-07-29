'use strict'

var Factura = require('../models/factura')
var Usuario = require('../models/usuario')
var Carrito = require('../models/carrito')
var Producto = require('../models/producto')

function crearFactura(req, res) {
    var factura = new Factura()

    var params = req.body

    if (req.user.rol == 'ROL_ADMINISTRADOR' && params.nombre) {
        factura.serieFactura = Math.trunc(Math.random() * 100)
        factura.NumeroFactura = Math.trunc(Math.random() * 100)
        factura.nombre = params.nombre
        factura.nit = 'Consumidor Final'
        factura.usuarioId = params.usuarioId

        factura.total = 0;
        factura.save((err, facturaGuardada) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion ' + err })

            return res.status(200).send({ factura: facturaGuardada })
        })
    }
}

function agregarDescripcion(req, res) {
    var facturaId = req.params.idFactura
    var usuarioId = req.user.sub
    var subt = null
    var car = req.body.carritoId

    Carrito.findById(car, (err, carritoDeCompras) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion de carrito' })
        if (!carritoDeCompras) return res.status(404).send({ message: 'El usuario no existe ' + carritoDeCompras })
        var subt = carritoDeCompras.subtotal
        console.log(carritoDeCompras.subtotal)
        Factura.findByIdAndUpdate(facturaId, { $push: { "descripcion": carritoDeCompras }, $inc: { total: subt } }, (err, factura) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion de factura ' + err })
            Carrito.findByIdAndDelete(car, (err, carrito) => {
                if (err) console.log(err)
                if (carrito) console.log(carrito)
            })
            return res.status(200).send({ FACTURA: factura })
        })

    })
}

module.exports = {
    crearFactura,
    agregarDescripcion
}