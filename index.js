import express from "express";
import dotenv from 'dotenv';
import { graphqlHTTP } from 'express-graphql'
import schema from "./schema/schema.js";
import colors from 'colors'
import { connectDB } from "./server/config/db.js";
import cors from 'cors'
dotenv.config();

const port = process.env.PORT || 5000


const app = express()
app.use(cors())
app.use( "/graphql", graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development' 
}))


const start = async()=>{
    await connectDB()
    app.listen(port, function(){
        console.log('port is running on port ', port);
    })

}

start()