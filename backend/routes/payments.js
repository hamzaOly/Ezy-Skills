// backend/routes/payments.js
import express from "express";
import { sendPaymentEmails } from "../services/firebaseEmail.js";

const router = express.Router();
let pool;

export const setPool = (dbPool) => {
	pool = dbPool;
};

// Send payment notification email with Firebase
router.post("/notify", async (req, res) => {
	try {
		const { bundle_id, bundle_title, program_type, amount, customer } =
			req.body;

		// Validate input
		if (!bundle_id || !bundle_title || !amount || !customer) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		if (!customer.name || !customer.email || !customer.phone) {
			return res.status(400).json({ error: "Customer information incomplete" });
		}

		// Save payment to PostgreSQL database
		const paymentResult = await pool.query(
			`INSERT INTO payments 
            (bundle_id, customer_name, customer_email, customer_phone, amount, program_type, payment_status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
			[
				bundle_id,
				customer.name,
				customer.email,
				customer.phone,
				amount,
				program_type,
				"completed",
			],
		);

		const payment = paymentResult.rows[0];

		// Send emails using Firebase service
		await sendPaymentEmails({
			bundle_title,
			program_type,
			amount,
			customer,
			payment_id: payment.id,
			payment_date: payment.created_at,
		});

		res.json({
			success: true,
			message: "Payment recorded and emails sent successfully",
			payment_id: payment.id,
		});
	} catch (error) {
		console.error("❌ Payment notification error:", error);
		res.status(500).json({
			error: "Failed to process payment notification",
			message: error.message,
		});
	}
});

// Get all payments (admin only)
router.get("/", async (req, res) => {
	try {
		const result = await pool.query(`
            SELECT 
                p.*,
                b.title as bundle_title,
                u.email as user_email
            FROM payments p
            LEFT JOIN course_bundles b ON p.bundle_id = b.id
            LEFT JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC
        `);

		res.json({ payments: result.rows });
	} catch (error) {
		console.error("❌ Get payments error:", error);
		res.status(500).json({ error: "Server error" });
	}
});

// Get payment by ID
router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const result = await pool.query(
			`SELECT 
                p.*,
                b.title as bundle_title,
                b.description as bundle_description
            FROM payments p
            LEFT JOIN course_bundles b ON p.bundle_id = b.id
            WHERE p.id = $1`,
			[id],
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Payment not found" });
		}

		res.json({ payment: result.rows[0] });
	} catch (error) {
		console.error("❌ Get payment error:", error);
		res.status(500).json({ error: "Server error" });
	}
});

export default router;
