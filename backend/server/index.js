// server/index.js
import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());

app.get("/api", (req, res) => {
	res.json({ message: `Backend is working on port: ${PORT}` });
});

app.listen(PORT, () =>
	console.log(`Backend running on http://localhost:${PORT}`),
);
