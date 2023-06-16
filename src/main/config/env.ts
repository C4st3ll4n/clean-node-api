export default {
    MONGO_URL: process.env.MONGO_URL|| 'mongodb://localhost:27017/clean-node-api',
    PORT: process.env.PORT || 5050,
    SECRET: process.env.JWT_SECRET || "asldh6541!@#^Ç"
}