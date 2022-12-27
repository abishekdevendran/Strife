require('dotenv').config();
import mongoose from 'mongoose';

const mongoURL = process.env.MONGO_URL;
// write a function to connect to the database
const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURL!);
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.error((err as any).message);
    process.exit(1);
  }
};

export default connectDB();
