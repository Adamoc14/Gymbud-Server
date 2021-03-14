// Setting up the Activity Schema
import { mongoose } from '../connection.js';
import { Joi } from "../../Helpers_and_Imports/libs_required.js";

// Declaring our Schemas for Validation but also for use of the mongoose Models
const activitySchema = new mongoose.Schema({
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
    Intensity_Level: String,
    Fitness_Level: String,
    Budget_Level: String,
    Activity_Image_Url: String,
    Resources: [String],
    Participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}),

//Joi Documentation for Schemas - https://joi.dev/api/?v=17.4.0
activityValidationSchema = Joi.object().keys({
    Creator: Joi.object().required(),
    Time: Joi.string().trim().required(),
    Date: Joi.string().trim().required(),
    Location: Joi.string().trim().required(),
    Duration: Joi.string().trim().required(),
    Activity_Type: Joi.string().trim().required(),
    Activity_Name: Joi.string().trim().required(),
    Activity_Description: Joi.string().trim().required(),
    Activity_Gender_Preference: Joi.string().trim().required(),
    Intensity_Level: Joi.string().trim().required(),
    Fitness_Level: Joi.string().trim().required(),
    Budget_Level: Joi.string().trim().required(),
    Activity_Image_Url: Joi.string().trim().required(),
    Resources: Joi.array().items(Joi.string()),
    Participants: Joi.array().items(Joi.object())
}),

activity = mongoose.model("Activity", activitySchema)

export { activity  , activityValidationSchema }