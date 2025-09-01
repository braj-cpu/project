import dotenv from "dotenv";
import connectDB from "../db/index.js";

dotenv.config();// It reads your .env file (a text file with key=value pairs).

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running`)
    })
})
.catch((err)=>{
    console.log("MONGODB connection failed !!!", err)
})







/*
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
        console.error("DB connection FAILED" , error);
    }
})();

*/

