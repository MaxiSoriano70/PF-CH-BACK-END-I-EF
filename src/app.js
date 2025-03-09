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
    console.log("Nuevo usuario conectado");

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
            console.log(response);
            io.emit("productoAgregado", nuevoProducto);
        } catch (error) {
            console.error("Error al agregar producto");
        }
    });
});

io.on("connection", (socket) => {
    socket.on("eliminarProducto", async (productoId) => {
        try {
            const response = await Producto.findByIdAndDelete(productoId);
            if (!response) {
                return socket.emit("errorProducto", "Producto no encontrado.");
            }

            // Notificar al usuario que eliminó el producto
            socket.emit("productoEliminado", productoId);

            // Notificar a los demás usuarios que el producto fue eliminado
            socket.broadcast.emit("productoRemovido", productoId);

        } catch (error) {
            console.error("Error en el servidor al eliminar producto", error);
            socket.emit("errorProducto", "Hubo un error al eliminar el producto.");
        }
    });
});


server.listen(PORT, () =>{
    console.log(`Servidor iniciado en: http://localhost:${PORT}`);
});