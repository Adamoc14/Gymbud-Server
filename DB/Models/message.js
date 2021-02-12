// Setting up the Message Schema
import mongoose from '../connection.js';
import { Joi } from "../../Helpers_and_Imports/libs_required.js";

// Declaring our Schemas for Validation but also for use of the mongoose Models
const messageSchema = new mongoose.Schema({
    Date: String,
    Time: String,
    Content: String,
    Sender: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    Reciever: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
}),

//Joi Documentation for Schemas - https://joi.dev/api/?v=17.4.0
messageValidationSchema = Joi.object().keys({
    Sender: Joi.string().trim().required(),
    Time: Joi.string().trim().required(),
    Date: Joi.string().trim().required(),
    Content: Joi.string().trim().required(),
    Reciever: Joi.string().trim().required(),
}),

message = mongoose.model("Message", messageSchema)

export { message , messageValidationSchema }