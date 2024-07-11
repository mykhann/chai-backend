import { app } from "./app.js";
import Dbconnect from "./db/index.js";
import "dotenv/config"

Dbconnect().then(()=>{
    app.listen(process.env.PORT||2000,(req,res)=>{
        console.log(`Server is Listening!! http://localhost:${process.env.PORT}`);

    })
}).catch((err)=>{
    console.log("Error connecting to MongoDB database !!",err)
});