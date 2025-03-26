import express from "express";
import Producto from "../models/producto.model.js";

const viewsRouter =  express.Router();

viewsRouter.get("/", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const productos = await Producto.paginate({}, { page, limit, lean: true });

    const totalPages = productos.totalPages;
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    res.render("home", {
        productos: productos.docs,
        currentPage: page,
        totalPages: totalPages,
        nextPage: nextPage,
        prevPage: prevPage
    });
});

viewsRouter.get("/producto/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const producto = await Producto.findById(pid).lean();

        if (!producto) {
            return res.status(404).send({ status: "error", message: "Producto no encontrado." });
        }

        res.render("detalleProducto", { producto });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

viewsRouter.get("/realtimeproductos", async (req, res) => {
    const productos = await Producto.find().lean();
    res.render("realTimeProductos", {productos});
});

export default viewsRouter;