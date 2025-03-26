import express from "express";
import Carrito from "../models/carrito.model.js";
import Producto from "../models/producto.model.js";

const carritoRouter = express.Router();

/*Obtener todos los carritos*/
carritoRouter.get("/", async (req, res) => {
    try {
        const carritos = await Carrito.find().populate("productos.producto");
        res.status(200).send({ status: "success", payload: carritos });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

/*Crear un nuevo carrito*/
carritoRouter.post("/", async (req, res) => {
    try {
        const { productos } = req.body;

        if (!productos || !Array.isArray(productos) || productos.length === 0) {
            return res.status(400).send({ status: "error", message: "El carrito debe contener al menos un producto." });
        }

        for (const item of productos) {
            const productoExistente = await Producto.findById(item.producto);
            if (!productoExistente) {
                return res.status(404).send({ status: "error", message: `El producto con ID ${item.producto} no existe.` });
            }
        }

        const nuevoCarrito = await Carrito.create({ productos });
        res.status(201).send({ status: "success", payload: nuevoCarrito });

    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

/*Editar Carrito*/
carritoRouter.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const { productos } = req.body;

        if (!productos || !Array.isArray(productos)) {
            return res.status(400).send({ status: "error", message: "Debes enviar una lista de productos." });
        }

        const carrito = await Carrito.findById(cid);
        if (!carrito) {
            return res.status(404).send({ status: "error", message: "Carrito no encontrado." });
        }

        const productosEnCarrito = new Map(carrito.productos.map(p => [p.producto.toString(), p]));

        for (const item of productos) {
            const productoExistente = await Producto.findById(item.producto);
            if (!productoExistente) {
                return res.status(404).send({ status: "error", message: `El producto con ID ${item.producto} no existe.` });
            }

            if (productosEnCarrito.has(item.producto)) {
                productosEnCarrito.get(item.producto).cantidad = item.cantidad;
            } else {
                productosEnCarrito.set(item.producto, { producto: item.producto, cantidad: item.cantidad });
            }
        }

        carrito.productos = Array.from(productosEnCarrito.values());

        await carrito.save();

        const carritoActualizado = await Carrito.findById(cid).populate("productos.producto");
        res.status(200).send({ status: "success", payload: carritoActualizado });

    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

/*Actualizar la cantidad de un producto en el carrito*/
carritoRouter.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { cantidad } = req.body;

        if (typeof cantidad !== "number" || cantidad <= 0) {
            return res.status(400).send({ status: "error", message: "La cantidad debe ser un número positivo." });
        }

        const carrito = await Carrito.findById(cid);
        if (!carrito) {
            return res.status(404).send({ status: "error", message: "Carrito no encontrado." });
        }

        const productoEnCarrito = carrito.productos.find(item => item.producto.toString() === pid);
        if (!productoEnCarrito) {
            return res.status(404).send({ status: "error", message: "Producto no encontrado en el carrito." });
        }

        productoEnCarrito.cantidad = cantidad;

        await carrito.save();

        const carritoActualizado = await Carrito.findById(cid).populate("productos.producto");
        res.status(200).send({ status: "success", payload: carritoActualizado });

    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

/*Obtener un carrito por ID*/
carritoRouter.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;

        const carrito = await Carrito.findById(cid).populate("productos.producto");

        if (!carrito) {
            return res.status(404).send({ status: "error", message: "Carrito no encontrado." });
        }

        res.status(200).send({ status: "success", payload: carrito });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

/*Eliminar un producto específico del carrito*/
carritoRouter.delete("/:cid/productos/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const carrito = await Carrito.findById(cid);
        if (!carrito) {
            return res.status(404).send({ status: "error", message: "Carrito no encontrado." });
        }

        const productosActualizados = carrito.productos.filter(item => item.producto.toString() !== pid);

        if (productosActualizados.length === carrito.productos.length) {
            return res.status(404).send({ status: "error", message: "Producto no encontrado en el carrito." });
        }

        carrito.productos = productosActualizados;
        await carrito.save();

        const carritoActualizado = await Carrito.findById(cid).populate("productos.producto");
        res.status(200).send({ status: "success", payload: carritoActualizado });

    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

/*Eliminar un carrito por ID*/
carritoRouter.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const response = await Carrito.findByIdAndDelete(cid);
        if (!response) {
            return res.status(404).send({ status: "error", message: "Carrito no encontrado." });
        }
        res.status(200).send({ status: "success", payload: response });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

export default carritoRouter;
