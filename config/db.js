import mongoose from "mongoose";
import color from "colors"

const connectDB =  async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(
            'Connected to MongoDb Database ${mongoose.connection.host}'.bgGreen.white
        );
    }catch(error){
        console.log('MongoDB error ${error}'.bgBlue.white);
    }
};

export default connectDB;