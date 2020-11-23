// Setting up the Session Schema
import mongoose from '../connection.js';
sessionSchema = new mongoose.Schema({
    Date: String,
    Time: String,
    Video_Or_In_Person: String,
    Intensity_Level: String,
    Activity: String,
    Resources: [String],
    Users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
}),
session = mongoose.model("Session", sessionSchema)
export { session }