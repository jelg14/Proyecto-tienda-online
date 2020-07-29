'use strict'

var Producto = require('../models/producto')

function agregarProducto(req, res) {
    var producto = new Producto()
    var params = req.body;
    if (req.user.rol == 'ROL_ADMINISTRADOR') {
        if (params.nombre && params.descripcion && params.cantidadDisponible) {
            producto.nombreProducto = params.nombre
            producto.descripcion = params.descripcion
            producto.cantidadDisponible = params.cantidadDisponible
            producto.precio = params.precio
            producto.numeroDeVentas = params.numeroDeVentas
            producto.categoriaId = params.categoriaId

            Producto.find({ $or: [{ nombreProducto: producto.nombreProducto }] }).exec((err, productos) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion de usuarios' })
                if (productos && productos.length >= 1) {
                    return res.status(500).send({ message: 'El producto ya existe' })
                } else {
                    producto.save((err, productoNuevo) => {
                        if (err) return res.status(500).send({ message: 'Error al ingresar producto nuevo: ' + err })

                        return res.status(200).send({ Producto_nuevo: productoNuevo })
                    })
                }
            })
        } else {
            return res.status(500).send({ message: 'ingrese todos los datos correspondientes' })
        }
    } else {
        return res.status(500).send({ message: 'No tiene permisos para agregar un producto' })
    }
}

function listarProductoId(req, res) {
    var productoId = req.params.idProducto

    if (req.user.rol == 'ROL_ADMINISTRADOR') {
        Producto.findById(productoId, (err, producto) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion: ' + err })

            return res.status(200).send({ Producto: producto })
        })
    } else {
        return res.status(500).send({ message: 'No tiene permisos para listar los productos' })
    }
}

function listarProductosCategoria(req, res) {
    var categoria = req.params.idCategoria
    if (req.user.rol == 'ROL_ADMINISTRADOR') {
        Producto.find({ categoriaId: categoria }, (err, productos) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion: ' + err })

            return res.status(200).send({ ProductosDisponibles: productos })
        })
    } else {
        return res.status(500).send({ message: 'No tiene permisos para buscar un producto' })
    }
}

function listarProductos(req, res) {
    if (req.user.rol == 'ROL_ADMINISTRADOR') {
        Producto.find({}, (err, productos) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion: ' + err })

            return res.status(200).send({ ProductosDisponibles: productos })
        })
    } else {
        return res.status(500).send({ message: 'No tiene permisos para buscar un producto' })
    }
}

function editarProducto(req, res) {
    var productoId = req.params.idProducto
    var params = req.body
    if (req.user.rol == 'ROL_ADMINISTRADOR') {
        Producto.findByIdAndUpdate(productoId, params, { new: true }, (err, productoActualizado) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion: ' + err })
            if (!productoActualizado) return res.status(404).send({ message: 'No fue posible encontrar el producto' })

            return res.status(200).send({ Producto: productoActualizado })
        })
    } else {
        return res.status(500).send({ message: 'No tiene permisos para editar un producto' })
    }
}

function eliminarProducto(req, res) {
    var productoId = req.params.idProducto
    if (req.user.rol == 'ROL_ADMINISTRADOR') {
        Producto.findByIdAndDelete(productoId, (err, productoEliminado) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion: ' + err })
            if (!productoEliminado) return res.status(404).send({ message: 'No fue posible encontrar el producto' })

            return res.status(200).send({ Se_ha_eliminado_el_siguiente_producto: productoEliminado })
        })
    } else {
        return res.status(500).send({ message: 'No tiene permisos para eliminar un producto' })
    }
}
module.exports = {
    agregarProducto,
    listarProductoId,
    listarProductosCategoria,
    listarProductos,
    editarProducto,
    eliminarProducto
}