import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const Dbconnect=async()=>{
    try {
       const connectionInstance=await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`MONGO CONNECTED !! DB:HOST ${connectionInstance.connection.host}`);
    } catch (error) {
        
        console.log("MongoDb connection failed");
        process.exit(1);
    }
}

export default Dbconnect;