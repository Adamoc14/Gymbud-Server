// Setting up the Connection to my Mongo DB
import {mongoose, Pusher} from '../Helpers_and_Imports/libs_required.js'


//Pusher Config
const pusher = new Pusher({
    appId: "1171389",
    key: "9b49b4db0306d14a2271",
    secret: "e9bfced9284083810e3f",
    cluster: "eu",
    useTLS: true
  });

mongoose.connect("mongodb+srv://adamoc:gaelicfootball@gymbud.2cxta.mongodb.net/Gymbud?retryWrites=true&w=majority" , {
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB connected successfully")
}).catch((err) => {
    console.log(err)
})

mongoose.connection.once('open', () => {
    const changeStream = mongoose.connection.collection('conversations').watch()

    changeStream.on('change', (change) => {
        if (change.operationType === 'insert') {
            pusher.trigger('chats', 'newChat', {
                'change': change
            })
            console.log("New Conversation Made");
        } else if (change.operationType === 'update') {
            try{
                pusher.trigger('messages', 'newMessage', {
                    'change': change
                })
            } catch(e){
                console.log(e);
            }
            console.log("New Message Sent");
        } else {
            console.log('Error triggering Pusher...')
        }
    })
})

export {mongoose}


