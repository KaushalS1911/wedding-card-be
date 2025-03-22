const express = require("express");
const connectionDB = require("./configs/connection");
const exceptionHandler = require("./middlewares/exceptionErrorHandler");
const app = express();
const PORT = process.env.PORT || 8080;
const cookieParser = require('cookie-parser')
const cors = require('cors');
require("dotenv").config();

//routes
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const contactRouter = require("./routes/contact");
const blogRouter = require("./routes/blog");
const parentCategoryRouter = require("./routes/parent-category");
const templateRouter = require("./routes/template");
const favouriteTemplatesRouter = require("./routes/favourite-templates");

//connection to database
connectionDB();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));

//Routes
app.get("/", (req, res) => {
    res.send("Hello From Server");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/contact", contactRouter)
app.use("/api/blog", blogRouter)
app.use("/api/parent-category", parentCategoryRouter)
app.use("/api/template", templateRouter)
app.use("/api/favourite-template", favouriteTemplatesRouter)

app.use("/", (req, res) => {
    res.status(404).json({status: 404, message: "Route does not exist"});
});
app.use(exceptionHandler);

app.listen(PORT, () => {
    console.log(`Your Server is running at PORT ${PORT}`);
});

