import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import dotenv from "dotenv";

dotenv.config();


import express from "express";
const app=express();

( async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error)=>{ //listens for server level error
            console.log("Errorr");
            throw error
        })
        app.get('/login', (req, res) => {
    res.send("hello");
});
        app.listen(process.env.PORT, ()=>{
            console.log(`App is listening on ${process.env.PORT}`)
        })
    }
    
    catch (error) {
        console.error("Error" , error);
    }
})();



