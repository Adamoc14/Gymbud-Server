// Variable Declarations and Imports
import { express } from './Helpers_and_Imports/libs_required.js'
import { userRouter } from './api/users.js'
import { sessionRouter } from './api/sessions.js'
const app = express(),
port = process.env.PORT || 7000


// Middlewares 

// These allow me to parse application/JSON data or form-encoded(HTML form POST) data on my server to retrieve req.body values
app.use(express.urlencoded({ extended: false }));
app.use(express.json())


// Routes
app.get("/", (req,res) => {
    res.send({
        message: "Well you're up and running, congrats"
    });
})

// Mounting the Routers at these URLS
app.use("/api/v1/users", userRouter)
app.use("/api/v1/sessions" , sessionRouter)

// App Listener 
app.listen(port , () => {
    console.log(`Your application is running on port ${port}, fair play chief`)
})