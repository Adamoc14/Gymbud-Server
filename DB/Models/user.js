// Setting up my User Schema
import { mongoose } from '../connection.js';
const userSchema = new mongoose.Schema({
    userName: String,
    password: String,
    Profile_Url : String,
    Name: String,
    Gender: String,
    DOB: String,
    Preferred_Intensity: String,
    Fitness_Level: String,
    Resources: [String],
    Preferred_Age_Range: String,
    Video_Or_In_Person: String,
    Messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    Matches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    Sessions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session"
    }]
}),
user = mongoose.model("User", userSchema)
export { user }
