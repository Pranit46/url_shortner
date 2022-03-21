const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
dbName = "SHORTURL_USER_DATABASEN1"
const dbUrl = `mongodb+srv://admin:<password>@pranit7.yhko9.mongodb.net/${dbName}`;
module.exports = { dbUrl, mongodb, MongoClient };
