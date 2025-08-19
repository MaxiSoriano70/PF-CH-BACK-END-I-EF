import express from "express";
import productosRouter from "./routes/productos.router.js";
import carritosRouter from "./routes/carrito.router.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import viewsRouter from "./routes/views.router.js";
import Producto from "./models/producto.model.js";
import connectMongoDB from "./db/db.js";

const app = express();

const PORT = 8080;

/* Creando servidor de forma explicita para configurarlo con las consultas web socket*/
const server = http.createServer(app);
const io = new Server(server);
connectMongoDB();

/*Middleware permite parsear el cuerpo de las solicitudes (request body) en formato JSON*/
app.use(express.json());
/* Aceptamos formularios */
app.use(express.urlencoded({extended:true}));
/* Configuracion public */
app.use(express.static("public"));
/*Handlebars*/
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/productos", productosRouter);
app.use("/api/carritos", carritosRouter);

app.use("/", viewsRouter);

/* Web Socket */
io.on("connection", (socket) => {
    console.log("Nuevo usuario conectado con ID:", socket.id);

    // Listener para cuando un cliente agrega un nuevo producto
    socket.on("nuevoProducto", async(productoDatos) => {
        try {
            console.log("Producto recibido en el servidor:", productoDatos);
            const nuevoProducto = new Producto({
                titulo: productoDatos["titulo"],
                descripcion: productoDatos["descripcion"],
                precio: Number(productoDatos["precio"]),
                codigo: productoDatos["codigo"],
                stock: Number(productoDatos["stock"]),
                estado: true,
                categoria: productoDatos["categoria"],
                urlImagen: productoDatos["urlImagen"]
            });

            const response = await nuevoProducto.save();
            console.log("Producto guardado, emitiendo a todos los clientes:", response);

            io.emit("productoAgregado", response);

        } catch (error) {
            console.error("Error al agregar producto:", error.message);

            socket.emit("errorProducto", "No se pudo agregar el producto.");
        }
    });


    socket.on("eliminarProducto", async (productoId) => {
        try {
            const response = await Producto.findByIdAndDelete(productoId);
            if (!response) {
                return socket.emit("errorProducto", "Producto no encontrado.");
            }

            io.emit("productoRemovido", productoId);

        } catch (error) {
            console.error("Error en el servidor al eliminar producto:", error);
            socket.emit("errorProducto", "Hubo un error al eliminar el producto.");
        }
    });

    // Aquí podrías agregar más listeners como "editarProducto", etc.
});


server.listen(PORT, () =>{
    console.log(`Servidor iniciado en: http://localhost:${PORT}`);
});