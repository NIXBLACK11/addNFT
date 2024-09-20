import express from 'express';
import cors from 'cors';

const addNFT = require('./routes/addNFT');

const app = express();

// middlewares
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: 'GET,POST,PUT,DELETE',  // Allowed HTTP methods
    credentials: true                // Allow credentials like cookies, authorization headers
}));

app.get("/", (req, res) => {
    res.json({
        message: "hello"
    });
});
app.use("/api", addNFT);

const httpServer = app.listen(3000);
