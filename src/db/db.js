import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.URI_MONGODB, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4
        });
        console.log("Conectado correctamente a MONGODB");
    } catch (error) {
        console.log("Error al conectar MONGODB: ", error.message);
    }
};

export default connectMongoDB;