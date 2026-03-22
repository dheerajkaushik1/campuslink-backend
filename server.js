const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoute = require('./routes/authRoutes');
const noteRoute = require('./routes/noteRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/notes", noteRoute);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDb Connected Successfully...");
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`)
        });
    })
    .catch(err => console.log(err));