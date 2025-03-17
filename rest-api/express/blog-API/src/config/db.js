import { connect } from 'mongoose';
import env from './dotenv.js';

const connectDB = async () => {
  try {
    const conn = await connect(env.DB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

export default connectDB;
