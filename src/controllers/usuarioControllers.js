'use strict'
//INPORTS
var bcrypt = require('bcrypt-nodejs')
var Usuario = require('../models/usuario')
var Carrito = require('../models/carrito')
var Producto = require('../models/producto')
var Factura = require('../models/factura')
var jwt = require('../services/jwt')
var path = require('path')
var fs = require('fs')


function registrarUsuario(req, res) {
    var user = new Usuario();
    var params = req.body

    if (params.nombre && params.password && params.email) {
        user.nombre = params.nombre;
        user.usuario = params.usuario;
        user.email = params.email;
        user.rol = 'ROL_USUARIO';
        Usuario.find({
            $or: [
                { usuario: user.usuario },
                { email: user.email }
            ]
        }).exec((err, users) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion de usuarios' })
            if (users && users.lenght >= 1) {
                return res.status(500).send({ message: 'El usuario ya existe' })
            } else {
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;

                    user.save((err, usuarioGuardado) => {
                        if (err) return res.status(500).send({ message: 'Error al guardar el Usuario' })
                        if (usuarioGuardado) {
                            res.status(200).send({ user: usuarioGuardado })
                        } else {
                            res.status(404).send({ message: 'No se ha podido registrar el usuario' })
                        }
                    })
                })
            }
        })
    } else {
        res.status(200).send({ message: 'Rellene todos los datos necesarios' })
    }

}

function crearCarrito(req, res, usuario, precio, cantidad, descripcion, idProducto) {

    var carrito = new Carrito()


    Usuario.findById(usuario, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })
        if (!usuarioEncontrado) return res.status(404).send({ message: 'El usuario no ha sido creado' })

        carrito.idProducto = idProducto;
        carrito.descripcion = descripcion;
        carrito.cantidad = cantidad;
        carrito.precio = precio;
        carrito.idUsuario = usuario;
        carrito.subtotal = carrito.cantidad * carrito.precio
        carrito.save((err, carritoCreado) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion de carrito' })
            if (!carritoCreado) return res.status(500).send({ message: 'Error al crear el carrito' })

            console.log(carritoCreado)
        })
    })
}

function registrarAdministrador(req, res) {
    var user = new Usuario();
    var params = req.body

    if (params.nombre && params.password && params.email) {
        user.nombre = params.nombre;
        user.usuario = params.usuario;
        user.email = params.email;
        user.rol = 'ROL_ADMINISTRADOR';
        Usuario.find({
            $or: [
                { usuario: user.usuario },
                { email: user.email }
            ]
        }).exec((err, users) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion de usuarios' })
            if (users && users.lenght >= 1) {
                return res.status(500).send({ message: 'El usuario ya existe' })
            } else {
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;

                    user.save((err, usuarioGuardado) => {
                        if (err) return res.status(500).send({ message: 'Error al guardar el Usuario' })
                        if (usuarioGuardado) {
                            res.status(200).send({ user: usuarioGuardado })
                        } else {
                            res.status(404).send({ message: 'No se ha podido registrar el usuario' })
                        }
                    })
                })
            }
        })
    } else {
        res.status(200).send({ message: 'Rellene todos los datos necesarios' })
    }
}

function login(req, res) {
    var params = req.body

    Usuario.findOne({ email: params.email }, (err, usuario) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })
        if (usuario) {
            bcrypt.compare(params.password, usuario.password, (err, check) => {

                if (check) {
                    if (params.gettoken) {
                        return res.status(200).send({
                            token: jwt.createToken(usuario)
                        })
                    } else {
                        usuario.password = undefined;
                        return res.status(200).send({ user: usuario });
                    }
                } else {
                    return res.status(400).send({ message: 'el usuario no se ha podido identificar' })
                }
            })
        } else {
            return res.status(404).send({ message: 'El usuario no se ha podido logear' })
        }
    })
}

function editarUsuario(req, res) {
    var params = req.body;
    var usuarioId = req.params.isUsuario

    Usuario.findByIdAndUpdate(usuarioId, params, { new: true }, (err, usuarioActualizado) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })
        if (!usuarioActualizado) return res.status(404).send({ message: 'No fue posible encontrar el usuario' })

        return res.status(200).send({ Usuario: usuarioActualizado })
    })
}

function eliminarUsuario(req, res) {
    var usuarioId = req.params.isUsuario

    Usuario.findByIdAndDelete(usuarioId, (err, usuarioEliminado) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })
        if (!usuarioEliminado) return res.status(404).send({ message: 'No fue posible encontrar el usuario' })

        return res.status(200).send({ Se_ha_eliminado_el_siguiente_usuario: usuarioEliminado })
    })
}


function productoMasVendido(req, res) {
    Producto.find({ numeroDeVentas: { $gt: 100 } }, (err, productos) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })

        return res.status(200).send({ Producto_mas_vendidos: productos })
    })
}

function ProductoAgotado(req, res) {
    Producto.find({ cantidadDisponible: { $eq: 0 } }, (err, productos) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })

        return res.status(200).send({ Producto_agotado: productos })
    })
}

function busquedaProductoNombre(req, res) {
    var nombre = req.body.nombre
    Producto.find({ nombreProducto: { $regex: nombre, $options: 'i' } }).exec((err, coincidencias) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })

        return res.status(200).send({ Coincidencias: coincidencias })
    })
}

function busquedaCategoria(req, res) {
    var categoria = req.body.categoria
    Categoria.find({ nombreCategoria: categoria }, { _id: 1 }, (err, categoriaEncontrada) => {
        var id = categoriaEncontrada._id;

        Producto.find({ categoriaId: id }, (err, productos) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' })

            return res.status(200).send({ Coincidencia_de_productos: productos })
        })
    })
}

function agregarAlCarrito(req, res) {
    var usuarioId = req.user.sub
    var params = req.body;
    var cantidad = params.cantidad
    var productoId = params.productoId


    Producto.findById(productoId, (err, productoEncontrado) => {
        if (err) return res.status(500).send({ message: 'error en la peticion de busqueda de producto' })
        if (!productoEncontrado) return res.status(404).send({ message: 'el producto no existe' })

        Carrito.countDocuments({ idProducto: productoId, idUsuario: usuarioId }, (err, findUser) => {
            if (findUser == 0) {
                if (productoEncontrado.cantidadDisponible < cantidad) return res.status(500).send({ message: "No hay productos suficientes para la peticion" })
                crearCarrito(req, res, usuarioId, productoEncontrado.precio, cantidad, productoEncontrado.nombreProducto, productoId)

                Carrito.find({ idUsuario: usuarioId }).update({ descripcion: productoEncontrado.nombreProducto, cantidad: cantidad, idProducto: productoEncontrado._id, precio: productoEncontrado.precio }, { new: true }, (err, usuarioEcontrado) => {
                    if (err) return res.status(500).send({ message: 'Error en la peticion de busqueda ' + err })
                    if (!usuarioEcontrado) return res.status(404).send({ message: 'El usuario no ha creado un carrito' })
                    Producto.findByIdAndUpdate(productoId, { $inc: { cantidadDisponible: params.cantidad * -1 } })
                    return res.status(200).send({ Carrito: usuarioEcontrado })
                })

            } else {

                if (productoEncontrado.cantidadDisponible < cantidad) return res.status(500).send({ message: "No hay productos suficientes para la peticion" })
                var precio = productoEncontrado.precio
                console.log(precio)
                Carrito.update({ idProducto: productoId }, { descripcion: productoEncontrado.nombreProducto, idProducto: productoEncontrado._id, precio: productoEncontrado.precio, $inc: { cantidad: cantidad, subtotal: cantidad * precio } }, { new: true }, (err, usuarioEcontrado) => {
                    if (err) return res.status(500).send({ message: 'Error en la peticion de busqueda ' + err })
                    if (!usuarioEcontrado) return res.status(404).send({ message: 'El usuario que busca no esta disponible ' + usuarioEcontrado })

                    Producto.findByIdAndUpdate(productoId, { $inc: { cantidadDisponible: cantidad * -1, numeroDeVentas: 1 } }, (err, producto) => {
                        if (err) console.log(err)
                        if (producto) console.log(producto)
                    })

                    return res.status(200).send({ Carrito: usuarioEcontrado })
                })
            }
        })

    })
}

function VerFactura(req, res) {
    var usuario = req.user.sub
    Factura.find({ usuarioId: usuario }, (err, facturas) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })
        return res.status(200).send({ Facturas: facturas })
    })
}


function controlStock(req, res) {
    Producto.find({}, { nombreProducto: 2, cantidadDisponible: 2 }, (err, stock) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })

        return res.status(200).send({ Stock_de_productos: stock })
    })
}


module.exports = {
    registrarUsuario,
    registrarAdministrador,
    login,
    editarUsuario,
    eliminarUsuario,
    productoMasVendido,
    busquedaProductoNombre,
    busquedaCategoria,
    agregarAlCarrito,
    VerFactura,
    ProductoAgotado,
    controlStock,
    crearCarrito
}