import mongoose from 'mongoose'

export const connectDB = async()=>{
   try {
    const conn = await mongoose.connect('mongodb://0.0.0.0:27017/GraphQL')
    console.log(`connected ${conn.connection.host}`.cyan.underline.bold);
   } catch (error) {
    console.log('mongoDb connect error ', error);
   }
}
