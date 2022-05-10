const MongoClient = require("mongodb").MongoClient;
const User = require("./user");

MongoClient.connect(
	// TODO: Connection 
	"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.jx2e8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
	{ useNewUrlParser: true },
).catch(err => {                       
	console.error(err.stack)
	process.exit(1)				           //if error 
}).then(async client => {
	console.log('Connected to MongoDB');   //if connected
	User.injectDB(client);
})
