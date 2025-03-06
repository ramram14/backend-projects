import app from "./app.js";
import env from "./config/dotenv.js";
import connectDB from "./config/db.js";

connectDB();

app.listen(env.PORT, () => {
    try {
        console.log(`Server is running on port ${env.PORT}`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
});