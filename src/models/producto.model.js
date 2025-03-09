import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        minlength: 3,
        trim: true,
    },
    descripcion: {
        type: String,
        required: true,
        minlength: 3,
        trim: true,
    },
    precio: {
        type: Number,
        required: true,
        min: 0,
    },
    codigo: {
        type: String,
        required: true,
        minlength: 3,
        unique: true,
        trim: true,
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        integer: true,
    },
    estado: {
        type: Boolean,
        required: true,
    },
    categoria: {
        type: String,
        required: true,
        minlength: 3,
        trim: true,
    },
    urlImagen: {
        type: String,
        required: true,
        validate: {
        validator: function (v) {
            return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i.test(v);
        },
        message: "La URL de la imagen no es válida. Debe ser una imagen (png, jpg, jpeg, gif, webp).",
        },
    },
}, {
    timestamps: true,
});

// Índices adicionales para mejorar las búsquedas y ordenamientos
productoSchema.index({ categoria: 1 });
productoSchema.index({ estado: 1 });
productoSchema.index({ createdAt: -1 });
productoSchema.index({ categoria: 1, estado: 1 });

// Agregar el plugin para paginación
productoSchema.plugin(mongoosePaginate);

const Producto = mongoose.model("Producto", productoSchema);
export default Producto;
