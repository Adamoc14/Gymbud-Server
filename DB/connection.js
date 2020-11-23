// Setting up the Connection to my Mongo DB
import {mongoose} from '../Helpers_and_Imports/libs_required.js'
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

export {mongoose}


