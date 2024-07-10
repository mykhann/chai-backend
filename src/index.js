import 'dotenv/config';

import connectDB from "./db/index.js";
import express from "express";
const app = express();

app.listen(process.env.PORT,(req,res)=>{
    console.log(`listening on ${process.env.PORT}`);

})
connectDB();