import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
    name:{
        type: String
    },
    email:{
        type: String,
        unique: true
    },
    phone:{
        type: String
    }
})
export default mongoose.model('Client', ClientSchema)