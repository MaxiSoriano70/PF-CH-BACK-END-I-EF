import express from "express";
import Carrito from "../models/carrito.model.js";

const carritoRouter = express.Router();

// Obtener todos los carritos
carritoRouter.get("/", async (req, res) => {
    try {
        const carritos = await Carrito.find().populate("productos.producto");
        res.status(200).send({ status: "success", payload: carritos });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

// Crear un nuevo carrito
carritoRouter.post("/", async (req, res) => {
    try {
        const { productos } = req.body;
        if (!productos || !Array.isArray(productos) || productos.length === 0) {
            return res.status(400).send({ status: "error", message: "El carrito debe contener al menos un producto." });
        }
        const nuevoCarrito = await Carrito.create({ productos });
        res.status(201).send({ status: "success", payload: nuevoCarrito });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

// Actualizar un carrito por ID
carritoRouter.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const carritoUpdates = req.body;
        const response = await Carrito.findByIdAndUpdate(cid, carritoUpdates, { new: true }).populate("productos.producto");
        if (!response) {
            return res.status(404).send({ status: "error", message: "Carrito no encontrado." });
        }
        res.status(200).send({ status: "success", payload: response });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

// Eliminar un carrito por ID
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
