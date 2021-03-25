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
    let conversations = await
    Conversation.find({})
    .populate({
        path: "Sender",
        populate: {
            path: "Conversations",
            populate: {
                path: "Sender"
            }
        }
    })
    .populate({
        path: "Sender",
        populate: {
            path: "Conversations",
            populate: {
                path: "Receiver"
            }
        }
    })
    .populate({
        path: "Sender",
        populate: {
            path: "Activities",
            populate: {
                path: "Participants"
            }
        }
    })
    .populate({
        path: "Receiver",
        populate: {
            path: "Conversations",
            populate: {
                path: "Sender"
            }
        }
    })
    .populate({
        path: "Receiver",
        populate: {
            path: "Conversations",
            populate: {
                path: "Receiver"
            }
        }
    })
    .populate({
        path: "Receiver",
        populate: {
            path: "Activities",
            populate: {
                path: "Participants"
            }
        }
    })
    // .populate({path: "Sender", populate: ['Conversations','Activities'] })
    // .populate({path: "Receiver", populate: ['Conversations','Activities']}).exec()
    res.send(conversations);
    // Conversation.find().populate({path : 'Sender', populate: ['Conversations', 'Conversations.Sender', 'Buds', 'Activities', 'Activities.Participants']})
    // .populate({path : 'Receiver' , populate: ['Conversations', 'Buds', 'Activities', 'Activities.Participants']})
    // .populate({path : 'Messages'}).exec();
    // res.send(conversations);
    

});


conversationRouter.get('/:conversationId', async(req, res) => {
    let errors = [];
    try {
        // Check the id is not null and trim it 
        req.params.conversationId = req?.params?.conversationId ?? errors.push("Invalid Id observed, undefined or null values were observed");
        req.params.conversationId = req?.params?.conversationId?.trim() ?? errors.push("Couln't parse invalid id with spaces");
        
        // Error Handling 
        if(errors.length > 0){
            res.status(500).send(errors);
        }

        // Get the valid id
        let searching_conversation_id =  req?.params?.conversationId;

        // Find the conversation 
        let conversation_found = await Conversation.findById(searching_conversation_id);

        // Populate the messages 
        conversation_found = await conversation_found
        .populate({
            path: "Sender",
            populate: {
                path: "Conversations",
                populate: {
                    path: "Sender"
                }
            }
        })
        .populate({
            path: "Sender",
            populate: {
                path: "Conversations",
                populate: {
                    path: "Receiver"
                }
            }
        })
        .populate({
            path: "Sender",
            populate: {
                path: "Activities",
                populate: {
                    path: "Participants"
                }
            }
        })
        .populate({
            path: "Receiver",
            populate: {
                path: "Conversations",
                populate: {
                    path: "Sender"
                }
            }
        })
        .populate({
            path: "Receiver",
            populate: {
                path: "Conversations",
                populate: {
                    path: "Receiver"
                }
            }
        })
        .populate({
            path: "Receiver",
            populate: {
                path: "Activities",
                populate: {
                    path: "Participants"
                }
            }
        })
        .populate("Messages").execPopulate();


        
        // Return last message
        res.status(200).send(conversation_found);

    } catch (error){
        console.log(error);
    }
})

conversationRouter.get('/:conversationId/last_message', async(req, res) => {
    let errors = [];
    try {
        // Check the id is not null and trim it 
        req.params.conversationId = req?.params?.conversationId ?? errors.push("Invalid Id observed, undefined or null values were observed");
        req.params.conversationId = req?.params?.conversationId?.trim() ?? errors.push("Couln't parse invalid id with spaces");
        
        // Error Handling 
        if(errors.length > 0){
            res.status(500).send(errors);
        }

        // Get the valid id
        let searching_conversation_id =  req?.params?.conversationId;

        // Find the conversation 
        let conversation_found = await Conversation.findById(searching_conversation_id);

        // Populate the messages 
        conversation_found = await conversation_found?.populate("Messages").execPopulate()

        // Sort the conversations by date
        let sorted_conversations_by_date = conversation_found?.Messages?.sort((b, a) => a.createdAt - b.createdAt);
        
        // Return last message
        res.status(200).send(sorted_conversations_by_date[0]);

    } catch (error){
        console.log(error);
    }
})


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
        
        // conversationCreated = await conversationCreated.populate({path : 'Sender', populate: ['Conversations', 'Buds', 'Activities']})
        // populate({path : 'Receiver', populate: ['Conversations', 'Buds', 'Activities']})
        // .populate("Messages").execPopulate()
        conversationCreated = await conversationCreated.populate({
            path: "Sender",
            populate: {
                path: "Conversations",
                populate: {
                    path: "Sender"
                }
            }
        })
        .populate({
            path: "Sender",
            populate: {
                path: "Conversations",
                populate: {
                    path: "Receiver"
                }
            }
        })
        .populate({
            path: "Sender",
            populate: {
                path: "Activities",
                populate: {
                    path: "Participants"
                }
            }
        })
        .populate({
            path: "Receiver",
            populate: {
                path: "Conversations",
                populate: {
                    path: "Sender"
                }
            }
        })
        .populate({
            path: "Receiver",
            populate: {
                path: "Conversations",
                populate: {
                    path: "Receiver"
                }
            }
        })
        .populate({
            path: "Receiver",
            populate: {
                path: "Activities",
                populate: {
                    path: "Participants"
                }
            }
        }).execPopulate()
        sendSuccess(res, "You have successfully created a conversation", conversationCreated)
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



// General Helper Method to send Success message back to Client when Error occurs and redirect
const sendSuccess = (res, successMsg, createduser, redirectUrl) => {
    res.send({
        success_msg: successMsg,
        user: createduser,
        redirectUrl: redirectUrl != null || redirectUrl != undefined ? redirectUrl : ""
    })
}

export { conversationRouter }