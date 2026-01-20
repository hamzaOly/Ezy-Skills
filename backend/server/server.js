const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Define a simple API route
app.get("/api", (req, res) => {
	res.json({ message: "Hello from the backend!" });
});
app.use((req, res, next) => {
	res.setHeader(
		"Content-Security-Policy",
		"default-src 'self' http://localhost:5173",
	);
	next();
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
