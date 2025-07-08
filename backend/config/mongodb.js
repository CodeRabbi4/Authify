import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/Mern-Auth`),
    console.log("Database connected");
  } catch (err) {
    console.error("Database connection failed");
  }
};

export default connectDB;
