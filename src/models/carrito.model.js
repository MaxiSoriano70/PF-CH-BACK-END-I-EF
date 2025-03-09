import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const carritoSchema = new mongoose.Schema({
    productos: [
        {
        producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Producto",
            required: true,
        },
        cantidad: {
            type: Number,
            required: true,
            min: 1,
            integer: true,
        },
        },
    ],
}, {
    timestamps: true,
});

carritoSchema.plugin(mongoosePaginate);

const Carrito = mongoose.model("Carrito", carritoSchema);
export default Carrito;
