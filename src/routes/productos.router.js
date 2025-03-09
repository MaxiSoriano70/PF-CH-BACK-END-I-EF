import express from "express";
import Producto from "../models/producto.model.js";

const productoRouter = express.Router();

// Obtener todos los productos
productoRouter.get("/", async (req, res) => {
    try {
        const productos = await Producto.find();
        res.status(200).send({ status: "success", payload: productos });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

// Crear un nuevo producto
productoRouter.post("/", async (req, res) => {
    try {
        const { titulo, descripcion, precio, codigo, stock, estado, categoria, urlImagen } = req.body;
        if (!titulo || !descripcion || !precio || !codigo || !stock || estado === undefined || !categoria || !urlImagen) {
            return res.status(400).send({ status: "error", message: "Todos los campos obligatorios deben estar completos." });
        }
        const nuevoProducto = new Producto({ titulo, descripcion, precio, codigo, stock, estado, categoria, urlImagen });
        const response = await nuevoProducto.save();
        res.status(201).send({ status: "success", payload: response });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

// Actualizar un producto por ID
productoRouter.put("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const productoUpdates = req.body;
        const response = await Producto.findByIdAndUpdate(pid, productoUpdates, { new: true });
        if (!response) {
            return res.status(404).send({ status: "error", message: "Producto no encontrado." });
        }
        res.status(200).send({ status: "success", payload: response });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

productoRouter.delete("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const response = await Producto.findByIdAndDelete(pid);
        if (!response) {
            return res.status(404).send({ status: "error", message: "Producto no encontrado." });
        }
        res.status(200).send({ status: "success", payload: response });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

export default productoRouter;
