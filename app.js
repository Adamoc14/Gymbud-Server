// Variable Declarations and Imports
import { express, session, cookieParser, passport, cors } from './Helpers_and_Imports/libs_required.js'
import { userRouter } from './api/users.js'
import { sessionRouter } from './api/sessions.js'
import { conversationRouter }  from './api/conversations.js'
import passportInitialize from './Helpers_and_Imports/passport_config.js'
import { upload } from './Helpers_and_Imports/cloudinary.js'
const app = express(),
    port = process.env.PORT || 7000


// Middlewares 

// These allow me to parse application/JSON data or form-encoded(HTML form POST) data on my server to retrieve req.body values
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(
    cors({
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    })
);

// These middlewares are used to set up my login auth system and are taken from this video - https://www.youtube.com/watch?v=IUw_TgRhTBE&ab_channel=NathanielWoodbury
app.use(cookieParser('secretcode'))
app.use(
    session({
        secret: 'secretcode',
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: (1000 * 60 * 100)
        }
    })
)
app.use(passport.initialize())
app.use(passport.session())
passportInitialize(passport)



// Routes
app.get("/", (req, res) => {
    res.send({
        message: "Well you're up and running, congrats"
    });
})

app.post("/image/upload", upload.single('uploadingImage'), async (req, res) => {
    if (!req.file) return res.send("Please upload a file");
    res.json(req.file);
});

// Mounting the Routers at these URLS
app.use("/api/v1/users", userRouter)
app.use("/api/v1/sessions", sessionRouter)
app.use("/api/v1/conversations", conversationRouter)


// App Listener 
app.listen(port, () => {
    console.log(`Your application is running on port ${port}, fair play chief`)
})