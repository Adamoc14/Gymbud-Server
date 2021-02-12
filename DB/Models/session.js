// Setting up the Session Schema
import { mongoose } from '../connection.js';
import { Joi } from "../../Helpers_and_Imports/libs_required.js";

// Declaring our Schemas for Validation but also for use of the mongoose Models
const sessionSchema = new mongoose.Schema({
    Creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    Time: String,
    Date: String,
    Location: String,
    Duration: String,
    Activity_Type: String, 
    Activity_Name: String,
    Activity_Description: String,
    Activity_Gender_Preference: String,
    Video_Or_In_Person: String,
    Intensity_Level: String,
    Activity_Image_Url: String,
    Resources: [String],
    Capacity: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}),

//Joi Documentation for Schemas - https://joi.dev/api/?v=17.4.0
sessionValidationSchema = Joi.object().keys({
    Creator: Joi.string().trim().required(),
    Time: Joi.string().trim().required(),
    Date: Joi.string().trim().required(),
    Location: Joi.string().trim().required(),
    Duration: Joi.string().trim().required(),
    Activity_Type: Joi.string().trim().required(),
    Activity_Name: Joi.string().trim().required(),
    Activity_Description: Joi.string().trim().required(),
    Activity_Gender_Preference: Joi.string().trim().required(),
    Video_Or_In_Person: Joi.string().trim().required(),
    Intensity_Level: Joi.string().trim().required(),
    Activity_Image_Url: Joi.string().trim().required(),
    Resources: Joi.array().items(Joi.string()),
    Capacity: Joi.array().items(Joi.string())
}),

session = mongoose.model("Session", sessionSchema)

export { session  , sessionValidationSchema }