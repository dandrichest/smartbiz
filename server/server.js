import 'dotenv/config';
import express from 'express';
import connectDB from './DB/connection.js';

const app = express();
const PORT = process.env.PORT || 5000;

//middleware
app.use(express.json())

//Routes will go here (Judy)

//Connet to DB and then start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});





