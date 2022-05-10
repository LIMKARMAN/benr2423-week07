const MongoClient = require("mongodb").MongoClient;
const User = require("./user")

///////////////////////sample user (used to test)//////////////////////////////

const username = "user1"																
const password = "passwordfromuser1"
const encrypt = "$2a$10$VjvtPgldEMsz5C9GUlyhDenl.Xc7gY82bvDUiCaEKUXUHFcL4cH4u"

//////////////////////////////////////////////////////////////////////////////

describe("User Account", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(		//connection to mongoDB
			"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.jx2e8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
			{ useNewUrlParser: true },
		);
		User.injectDB(client);
	})
	afterAll(async () => {
		await client.close();
	})

//////////////////////////////////////////////////////////////////////////////

	//if new user is created, this test should be pass
	test("New user registration", async () => {				
		const res = await User.register(username, password)
		expect(res).toBe("new user created");		
	})

	//if duplicate user is found, this test should be pass
	//#duplicate test might pass also when checking for registration, because the function is
	//#executed twice and the insertion is made before checking for the duplicate
	test("Duplicate username", async () => {
		const res = await User.register(username, password)
		expect(res).toBe("user exist");
	})

//////////////////////////////////////////////////////////////////////////////

	//if sample user's username and password doesn't match to any documents (aka the document doesn't exists)
	test("Username doesn't exist to login", async () => {
		const res = await User.login(username, password)
		expect(res).toBe("There is not such document");
	})

	//if sample user's username doesn't match to any document's username
	test("User login invalid username", async () => {
		const res = await User.login(username, password)
		expect(res).toBe("invalid username");
	})

	//if sample user's password doesn't match to any document's password
	test("User login invalid password", async () => {
		const res = await User.login(username, password)
		expect(res).toBe("invalid password");
	})

	//if username and password are matched, check for the encrypt password before allow user to login
	test("User login successfully", async () => {
		const res = await User.login(username, password)
		expect(res.username).toBe(username);
		expect(res.password).toBe(password);
		expect(res.encrypt).toBe(encrypt);
	})
});
