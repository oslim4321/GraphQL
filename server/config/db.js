import mongoose from 'mongoose'

export const connectDB = async()=>{
   try {
    const conn = await mongoose.connect(process.env.Mongo_URI)
    console.log(`connected ${conn.connection.host}`.cyan.underline.bold);
   } catch (error) {
    console.log('mongoDb connect error ', error);
   }
}
