'use strict'
var Categoria = require('../models/categoria')
var Producto = require('../models/producto')

function agregarCategoria(req, res) {
    var categoria = new Categoria();
    var params = req.body

    if (req.user.rol == 'ROL_ADMINISTRADOR') {
        categoria.nombreCategoria = params.categoria
        categoria.descripcion = params.descripcion

        Categoria.find({ $or: [{ nombreCategoria: categoria.nombreCategoria }] }).exec((err, categorias) => {
            if (categorias && categorias.length >= 1) {
                return res.status(500).send({ message: 'La categoria ya existe' })
            } else {
                categoria.save((err, categoria) => {
                    if (err) return res.status(500).send({ message: 'Error en la peticion' })

                    return res.status(200).send({ Categoria: categoria })
                })
            }

        })

    } else {
        return res.status(500).send({ message: 'No tiene permisos para agregar una categoria' })
    }

}

function listarCategorias(req, res) {
    if (req.user.rol == 'ROL_ADMINISTRADOR') {
        Categoria.find({}, (err, categorias) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' })

            return res.status(200).send({ Categorias_disponibles: categorias })
        })
    } else {
        return res.status(500).send({ message: 'No tiene permisos para visualizar las categorias' })

    }
}

function editarCategoria(req, res) {
    var Idcategoria = req.params.idCategoria
    var params = req.body
    if (req.user.rol == 'ROL_ADMINISTRADOR') {
        Categoria.findByIdAndUpdate(Idcategoria, params, { new: true }, (err, categoria) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' })
            if (!categoria) return res.status(404).send({ message: 'No fue posible encontrar la categoria' })

            return res.status(200).send({ Categoria: categoria })
        })
    } else {
        return res.status(500).send({ message: 'No tiene permisos para editar' })
    }
}

function categoriaPorDefecto(req, res) {
    Categoria.findOne({ nombreCategoria: 'Almacen' }, (err, Almacen) => {
        if (!Almacen) {
            console.log(Almacen)
            var categoria = new Categoria()
            categoria._id = "5e5acb024abfec09fc345c00"
            categoria.nombreCategoria = req.body.nombre
            categoria.descripcion = 'Almacen de productos'

            categoria.save((err, almacenGuardado) => {
                if (err) return res.status(500).send({ message: 'Error al crear almacen' })
                if (!almacenGuardado) return res.status(404).send({ message: 'El alamacen no ha sido creado' })

            })
        } else {}
    })
}

function eliminarCategoria(req, res) {
    var categoriaId = req.params.idCategoria
    if (req.user.rol == 'ROL_ADMINISTRADOR') {
        Categoria.findByIdAndDelete(categoriaId, { _id: 2, nombreCategoria: 0, descripcion: 0 }, (err, categoriaEliminada) => {
            console.log(categoriaEliminada._id)
            if (err) return res.status(500).send({ message: 'Error en la peticion: ' + err })
            if (!categoriaEliminada) {
                return res.status(404).send({ message: 'La categoria no existe' })

            } else {
                categoriaPorDefecto()
                Producto.updateMany({ categoriaId: categoriaEliminada._id }, { categoriaId: '5e5acb024abfec09fc345c00' }, { new: true }, (err, pro) => {
                    if (err) console.log('Error en la peticion de almacenar ' + err)
                    if (!pro) console.log(!pro)
                    if (pro) console.log(pro)
                })
                return res.status(200).send({ Se_ha_eliminado_la_siguiente_categoria: categoriaEliminada })
            }
        })
    } else {
        return res.status(500).send({ message: 'No tiene permisos para eliminar la categoria' })
    }
}
module.exports = {
    agregarCategoria,
    listarCategorias,
    editarCategoria,
    eliminarCategoria,
    categoriaPorDefecto
}