// backend/services/firebaseEmail.js
import admin from "firebase-admin";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin (only once)
let firebaseInitialized = false;

const initializeFirebase = () => {
	if (!firebaseInitialized) {
		try {
			const serviceAccount = JSON.parse(
				readFileSync(join(__dirname, "../serviceAccountKey.json"), "utf8"),
			);

			admin.initializeApp({
				credential: admin.credential.cert(serviceAccount),
			});

			firebaseInitialized = true;
			console.log("✅ Firebase Admin SDK initialized successfully");
		} catch (error) {
			console.error("❌ Firebase initialization error:", error.message);
			// Don't throw error - allow app to continue without Firebase logging
			console.warn(
				"⚠️  Continuing without Firebase. Emails will still be sent.",
			);
		}
	}
};

// Configure Nodemailer
const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.ADMIN_EMAIL,
		pass: process.env.ADMIN_EMAIL_PASSWORD,
	},
});

// Send payment emails
export const sendPaymentEmails = async (paymentData) => {
	// Try to initialize Firebase (for logging)
	initializeFirebase();

	const {
		bundle_title,
		program_type,
		amount,
		customer,
		payment_id,
		payment_date,
	} = paymentData;

	// Admin Email HTML
	const adminEmailHTML = `
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #1e40af; border-radius: 10px; overflow: hidden;">
			<!-- Header -->
			<div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center;">
				<h1 style="margin: 0; font-size: 28px;">💰 New Payment Received!</h1>
			</div>
			
			<!-- Body -->
			<div style="padding: 30px; background: #f9fafb;">
				<!-- Payment Details -->
				<div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
					<h2 style="color: #1e40af; margin-top: 0; border-bottom: 2px solid #FF9A76; padding-bottom: 10px;">Payment Details</h2>
					<table style="width: 100%; border-collapse: collapse;">
						<tr>
							<td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Bundle:</td>
							<td style="padding: 10px 0; color: #111827; font-weight: bold;">${bundle_title}</td>
						</tr>
						<tr>
							<td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Program Type:</td>
							<td style="padding: 10px 0; color: #111827;">${program_type}</td>
						</tr>
						<tr>
							<td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Amount:</td>
							<td style="padding: 10px 0; color: #059669; font-size: 20px; font-weight: bold;">₹${amount.toLocaleString()}</td>
						</tr>
						<tr>
							<td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Payment ID:</td>
							<td style="padding: 10px 0; color: #111827; font-family: monospace;">#${payment_id}</td>
						</tr>
						<tr>
							<td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Date:</td>
							<td style="padding: 10px 0; color: #111827;">${new Date(payment_date).toLocaleString()}</td>
						</tr>
					</table>
				</div>

				<!-- Customer Info -->
				<div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
					<h2 style="color: #1e40af; margin-top: 0; border-bottom: 2px solid #FF9A76; padding-bottom: 10px;">Customer Information</h2>
					<table style="width: 100%; border-collapse: collapse;">
						<tr>
							<td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Name:</td>
							<td style="padding: 10px 0; color: #111827; font-weight: bold;">${customer.name}</td>
						</tr>
						<tr>
							<td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Email:</td>
							<td style="padding: 10px 0; color: #111827;">${customer.email}</td>
						</tr>
						<tr>
							<td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Phone:</td>
							<td style="padding: 10px 0; color: #111827;">${customer.phone}</td>
						</tr>
					</table>
				</div>
			</div>

			<!-- Footer -->
			<div style="background: #1e40af; color: white; padding: 20px; text-align: center;">
				<p style="margin: 0; font-size: 14px;">This is an automated notification from your payment system</p>
			</div>
		</div>
	`;

	// Customer Email HTML
	const customerEmailHTML = `
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #10b981; border-radius: 10px; overflow: hidden;">
			<!-- Header -->
			<div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 40px; text-align: center;">
				<h1 style="margin: 0; font-size: 32px;">🎉 Thank You!</h1>
				<p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Your payment was successful</p>
			</div>
			
			<!-- Body -->
			<div style="padding: 30px; background: #f9fafb;">
				<p style="font-size: 16px; color: #111827; line-height: 1.6;">Dear <strong>${customer.name}</strong>,</p>
				<p style="font-size: 16px; color: #111827; line-height: 1.6;">Thank you for your purchase! Your payment has been successfully processed.</p>
				
				<!-- Order Summary -->
				<div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
					<h2 style="color: #1e40af; margin-top: 0; border-bottom: 2px solid #FF9A76; padding-bottom: 10px;">📦 Order Summary</h2>
					<table style="width: 100%; border-collapse: collapse;">
						<tr>
							<td style="padding: 12px 0; color: #6b7280; font-weight: 600;">Bundle:</td>
							<td style="padding: 12px 0; color: #111827; font-weight: bold; text-align: right;">${bundle_title}</td>
						</tr>
						<tr>
							<td style="padding: 12px 0; color: #6b7280; font-weight: 600;">Program:</td>
							<td style="padding: 12px 0; color: #111827; text-align: right;">${program_type}</td>
						</tr>
						<tr style="border-top: 2px solid #e5e7eb;">
							<td style="padding: 15px 0; color: #1e40af; font-weight: 700; font-size: 18px;">Total Paid:</td>
							<td style="padding: 15px 0; color: #059669; font-weight: bold; font-size: 22px; text-align: right;">₹${amount.toLocaleString()}</td>
						</tr>
						<tr>
							<td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Order ID:</td>
							<td style="padding: 8px 0; color: #6b7280; font-family: monospace; font-size: 14px; text-align: right;">#${payment_id}</td>
						</tr>
						<tr>
							<td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Date:</td>
							<td style="padding: 8px 0; color: #6b7280; font-size: 14px; text-align: right;">${new Date(payment_date).toLocaleString()}</td>
						</tr>
					</table>
				</div>

				<!-- Next Steps -->
				<div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 4px; margin: 25px 0;">
					<h3 style="color: #1e40af; margin-top: 0;">📋 What's Next?</h3>
					<ul style="color: #1f2937; line-height: 1.8; margin: 10px 0;">
						<li>You will receive access details via email within 24 hours</li>
						<li>Our team will contact you to schedule your sessions</li>
						<li>Keep this email for your records</li>
					</ul>
				</div>

				<p style="font-size: 16px; color: #111827; line-height: 1.6;">If you have any questions, feel free to reply to this email.</p>
				
				<p style="font-size: 16px; color: #111827; line-height: 1.6; margin-top: 30px;">Best regards,<br><strong>Your Team</strong></p>
			</div>

			<!-- Footer -->
			<div style="background: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
				<p style="margin: 0; font-size: 14px; color: #6b7280;">This is an automated confirmation email</p>
				<p style="margin: 10px 0 0 0; font-size: 12px; color: #9ca3af;">© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
			</div>
		</div>
	`;

	// Send emails
	try {
		const [adminResult, customerResult] = await Promise.all([
			transporter.sendMail({
				from: process.env.ADMIN_EMAIL,
				to: process.env.ADMIN_EMAIL,
				subject: `🎉 New Purchase - ${bundle_title}`,
				html: adminEmailHTML,
			}),
			transporter.sendMail({
				from: process.env.ADMIN_EMAIL,
				to: customer.email,
				subject: `✅ Payment Confirmation - ${bundle_title}`,
				html: customerEmailHTML,
			}),
		]);

		console.log("✅ Admin email sent:", adminResult.messageId);
		console.log("✅ Customer email sent:", customerResult.messageId);

		// Log to Firestore (if initialized)
		if (firebaseInitialized) {
			try {
				const db = admin.firestore();
				await db.collection("payment_notifications").add({
					payment_id,
					customer_email: customer.email,
					admin_email: process.env.ADMIN_EMAIL,
					bundle_title,
					amount,
					program_type,
					sent_at: admin.firestore.FieldValue.serverTimestamp(),
					status: "sent",
					admin_message_id: adminResult.messageId,
					customer_message_id: customerResult.messageId,
				});
				console.log("✅ Payment logged to Firestore");
			} catch (firestoreError) {
				console.warn("⚠️  Firestore logging failed:", firestoreError.message);
			}
		}

		return { success: true, adminResult, customerResult };
	} catch (error) {
		console.error("❌ Email sending error:", error);

		// Log error to Firestore (if initialized)
		if (firebaseInitialized) {
			try {
				const db = admin.firestore();
				await db.collection("payment_notifications").add({
					payment_id,
					error: error.message,
					sent_at: admin.firestore.FieldValue.serverTimestamp(),
					status: "failed",
				});
			} catch (firestoreError) {
				console.warn("⚠️  Error logging to Firestore failed");
			}
		}

		throw error;
	}
};

export default { sendPaymentEmails };
