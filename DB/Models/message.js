// Setting up the Message Schema
import mongoose from '../connection.js';
messageSchema = new mongoose.Schema({
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
message = mongoose.model("Message", messageSchema)
export { message }