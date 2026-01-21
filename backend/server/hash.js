import bcrypt from "bcrypt";

const password = "123456"; // put your desired password here

const hashPassword = async () => {
	const hash = await bcrypt.hash(password, 10);
	console.log("Bcrypt hash:", hash);
};

hashPassword();
