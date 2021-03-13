import { mongoose } from "../connection.js";
import { Joi } from '../../Helpers_and_Imports/libs_required.js'

const messageSchema = mongoose.Schema({
    Content: String,
    sender: {
        senderName: String,
        senderId: String,
    },
}, { timestamps: true }),

  // JOI documentation for error handling for schemas - https://www.youtube.com/watch?v=PwUoiTt2oKM&ab_channel=NoobCoder&fbclid=IwAR1FlAFIDWyItHSy9aSgFyGrWd9zGXgjQuL3wby1WWR27guh5okMXxERPxM
messageValidationSchema = Joi.object().keys({
    Content: Joi.string().trim().required(),
    sender: Joi.object().keys({
        senderName: Joi.string().trim().required(),
        senderId: Joi.string().trim().required(),
    })
});

const Message = mongoose.model("Message", messageSchema);

export { Message, messageValidationSchema };
