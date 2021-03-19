import { express } from "../Helpers_and_Imports/libs_required.js"
//Conversation model
import { Conversation, conversationValidationSchema } from "../DB/Models/conversation.js"
import { Message, messageValidationSchema } from "../DB/Models/message.js"
import { user } from "../DB/Models/user.js"
const conversationRouter = express.Router();

// Joi schema options
const options = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true //remove unknown props
};


// conversationRouter is mounted at /conversations, anything after this is prefixed with this

// Getting all conversations
conversationRouter.get("/", async (req, res) => {
    const conversations = 
    await Conversation.find({})
    .populate({path : 'Sender', populate: ['Conversations', 'Buds', 'Activities']})
    .populate({path : 'Receiver' , populate: ['Conversations', 'Buds', 'Activities']})
    .populate({path : 'Messages'})
    res.send(conversations);
  });

conversationRouter.post('/new_conversation', async(req, res) => {
    let errors = [];
    try{ 
        const { error } = conversationValidationSchema.validate(req.body, options);
        if (error !== undefined) errors.push(error) && res.send(errors)
        const { Sender, Receiver, Messages } = req.body
        const senderFound = await user.findById(Sender)
        const receiverFound = await user.findById(Receiver)
        let conversationCreated = await Conversation.create({Sender, Receiver, Messages});
        senderFound?.Conversations?.push(conversationCreated._id)
        receiverFound?.Conversations?.push(conversationCreated._id)
        await senderFound.save()
        await receiverFound.save()
        conversationCreated = await conversationCreated.populate("Sender").populate("Receiver").populate("Messages").execPopulate()
        sendSuccess(res, "", conversationCreated)
    } catch (error) {
        res.send(error)
    }
})

conversationRouter.post('/:conversationId/new_message', async (req, res) => {
    let errors = [];
    try {
        const { error } = messageValidationSchema.validate(req.body, options);
        if (error !== undefined) errors.push(error) && res.send(errors)
        const { Content, Sender } = req.body
        const messageCreated = await Message.create({ Content, Sender })
        const { conversationId } = req.params 
        let conversationFound = await Conversation.findById(conversationId)
        conversationFound.Messages.push(messageCreated)
        await conversationFound.save()
        conversationFound = await conversationFound.populate("Messages").execPopulate()
        sendSuccess(res, "", conversationFound)
    } catch (error) {
        res.send(error)
    }
    // Conversation.update(
    //     { _id: req.query.id },
    //     { $push: { conversation: req.body } },
    //     (err, data) => {
    //         if (err) {
    //             console.log('Error saving message...')
    //             console.log(err)

    //             res.status(500).send(err)
    //         } else {
    //             res.status(201).send(data)
    //         }
    //     }
    // )
})

conversationRouter.get('/get/conversationList', (req, res) => {
    mongoData.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            data.sort((b, a) => {
                return a.timestamp - b.timestamp;
            });

            let conversations = []

            data.map((conversationData) => {
                const conversationInfo = {
                    id: conversationData._id,
                    name: conversationData.chatName,
                    timestamp: conversationData.conversation[0].timestamp
                }

                conversations.push(conversationInfo)
            })

            res.status(200).send(conversations)
        }
    })
})

conversationRouter.get('/get/conversation', (req, res) => {
    const id = req.query.id

    mongoData.find({ _id: id }, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

conversationRouter.get('/get/lastMessage', (req, res) => {
    const id = req.query.id

    mongoData.find({ _id: id }, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            let convData = data[0].conversation

            convData.sort((b, a) => {
                return a.timestamp - b.timestamp;
            });

            res.status(200).send(convData[0])
        }
    })
})

// General Helper Method to send Success message back to Client when Error occurs and redirect
const sendSuccess = (res, successMsg, createduser, redirectUrl) => {
    res.send({
        success_msg: successMsg,
        user: createduser,
        redirectUrl: redirectUrl != null || redirectUrl != undefined ? redirectUrl : ""
    })
}

export { conversationRouter }