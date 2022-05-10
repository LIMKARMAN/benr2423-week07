let users;
const { hash } = require("bcrypt");									//For password encryption
const bcrypt = require("bcryptjs")
const saltRounds = 10;
var encrypt;

class User {
	static async injectDB(conn) {
		users = await conn.db("TDDweek7").collection("users")		//users = db.collection.
	}

	static async register(username, password) {
		// TODO: Hash password
		bcrypt.genSalt(saltRounds, function (saltError, salt) { 
			if (saltError) {
			  	throw saltError
			} else {
			  	bcrypt.hash(password, salt, function(hashError, hash) {    //encrypt password
					if (hashError) {
				  		throw hashError
					} else {
						encrypt = hash;
					}
			  	})
			}
		});
		// TODO: Check if username exists
		return users.findOne({							//find the document
			$and: [{ 
				'username': username,				
				'password': password
			}]
		}).then(async user =>{
			if (user) {
				if ( user.username == username )		//check whether the username exists or not
				{
					return "user exist";
				}
			}
			else
			{
				// TODO: Save user to database			//if username is not exist, create new
				await users.insertOne({					//insert new document
					'username' : username,
					'password' : password,
					'encrypt': encrypt
				})
				return "new user created";
			}
		})	
	}

	static async login(username, password) {
		// TODO: Check if username exists
		return users.findOne({															//find the document
			$or: [
				{'username': username},				
				{'password': password}
			]				
		}).then(async user =>{		
		// TODO: Validate password ( or username )
			if (user) {																	//if the username exists 
				if ( user.username != username && user.password == password) {			//if the username is invalid
					return "invalid username";
				}
				else if ( user.username == username && user.password != password ) {	//else if the password is invalid
					return "invalid password";
				}
				else																	//else username and password are valid
				{
					// TODO: Return user object
					return user;	
				}
			}
			else																		//else the username doesn't exists
			{
				return "There is not such document";
			}
		})
	}
}
module.exports = User;
