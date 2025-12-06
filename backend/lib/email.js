import nodemailer from 'nodemailer';
 
const createTransporter = () => {
	return nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASSWORD
		}
	});
};
 
export const sendPasswordResetEmail = async (email, resetUrl, userName) => {
	try {
		const transporter = createTransporter();

		const mailOptions = {
			from: {
				name: 'Daisy and more',
				address: process.env.EMAIL_USER
			},
			to: email,
			subject: 'Password Reset Request - Daisy and more',
			html: `
				<!DOCTYPE html>
				<html>
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<style>
						body {
							font-family: 'Arial', sans-serif;
							line-height: 1.6;
							color: #333;
							margin: 0;
							padding: 0;
							background-color: #f4f4f4;
						}
						.container {
							max-width: 600px;
							margin: 20px auto;
							background: #ffffff;
							border-radius: 10px;
							overflow: hidden;
							box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
						}
						.header {
							background: linear-gradient(135deg, #2d2d2d 0%, #111 100%);
							color: #ffffff;
							padding: 40px 30px;
							text-align: center;
						}
						.header h1 {
							margin: 0;
							font-size: 32px;
							font-weight: 300;
							letter-spacing: 2px;
							text-transform: uppercase;
						}
						.content {
							padding: 40px 30px;
						}
						.greeting {
							font-size: 18px;
							font-weight: 600;
							color: #111;
							margin-bottom: 20px;
						}
						.message {
							font-size: 15px;
							color: #666;
							margin-bottom: 30px;
							line-height: 1.8;
						}
						.button-container {
							text-align: center;
							margin: 40px 0;
						}
						.reset-button {
							display: inline-block;
							padding: 16px 40px;
							background: #2d2d2d;
							color: #ffffff !important;
							text-decoration: none;
							border-radius: 5px;
							font-weight: 700;
							font-size: 14px;
							text-transform: uppercase;
							letter-spacing: 1.5px;
							transition: all 0.3s;
						}
						.reset-button:hover {
							background: #111;
						}
						.link-box {
							background: #f9f9f9;
							border-left: 4px solid #2d2d2d;
							padding: 15px;
							margin: 30px 0;
							word-break: break-all;
							font-size: 13px;
							color: #666;
						}
						.warning {
							background: #fff3cd;
							border-left: 4px solid #ffc107;
							padding: 15px;
							margin: 20px 0;
							font-size: 14px;
							color: #856404;
						}
						.footer {
							background: #f9f9f9;
							padding: 30px;
							text-align: center;
							font-size: 13px;
							color: #999;
							border-top: 1px solid #e5e5e5;
						}
						.footer a {
							color: #2d2d2d;
							text-decoration: none;
							font-weight: 600;
						}
						.social-links {
							margin: 20px 0;
						}
						.social-links a {
							display: inline-block;
							margin: 0 10px;
							color: #666;
							text-decoration: none;
						}
					</style>
				</head>
				<body>
					<div class="container">
						<!-- Header -->
						<div class="header">
							<h1>Daisy and more</h1>
							<p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Fashion & Style</p>
						</div>

						<!-- Content -->
						<div class="content">
							<div class="greeting">
								Hello${userName ? ' ' + userName : ''},
							</div>

							<div class="message">
								We received a request to reset the password for your Daisy and more account.
								If you made this request, click the button below to reset your password.
							</div>

							<div class="button-container">
								<a href="${resetUrl}" class="reset-button">
									Reset Password
								</a>
							</div>

							<div class="message">
								Or copy and paste this link into your browser:
							</div>

							<div class="link-box">
								${resetUrl}
							</div>

							<div class="warning">
								<strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons.
							</div>

							<div class="message">
								If you didn't request a password reset, you can safely ignore this email.
								Your password will remain unchanged.
							</div>

							<div class="message" style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e5e5;">
								<strong>Security Tips:</strong><br>
								• Never share your password with anyone<br>
								• Use a strong, unique password<br>
								• Enable two-factor authentication when available
							</div>
						</div>

						<!-- Footer -->
						<div class="footer">
							<div class="social-links">
								<a href="#">Facebook</a> •
								<a href="#">Instagram</a> •
								<a href="#">Twitter</a>
							</div>
							<p style="margin: 10px 0;">
								© ${new Date().getFullYear()} Daisy and more. All rights reserved.
							</p>
							<p style="margin: 10px 0; font-size: 12px;">
								This is an automated message, please do not reply to this email.
							</p>
							<p style="margin: 10px 0; font-size: 12px;">
								<a href="#">Privacy Policy</a> •
								<a href="#">Terms of Service</a> •
								<a href="#">Contact Support</a>
							</p>
						</div>
					</div>
				</body>
				</html>
			`, 
			text: `
Hello${userName ? ' ' + userName : ''},

We received a request to reset the password for your Daisy and more account.

If you made this request, click the link below to reset your password:
${resetUrl}

This link will expire in 1 hour for security reasons.

If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

Security Tips:
• Never share your password with anyone
• Use a strong, unique password
• Enable two-factor authentication when available

© ${new Date().getFullYear()} Daisy and more. All rights reserved.
This is an automated message, please do not reply to this email.
			`
		};

		const info = await transporter.sendMail(mailOptions);
		console.log('✅ Password reset email sent:', info.messageId);
		return { success: true, messageId: info.messageId };
	} catch (error) {
		console.error('❌ Error sending password reset email:', error);
		throw error;
	}
};
 
export const sendPasswordResetConfirmationEmail = async (email, userName) => {
	try {
		const transporter = createTransporter();

		const mailOptions = {
			from: {
				name: 'Daisy and more',
				address: process.env.EMAIL_USER
			},
			to: email,
			subject: 'Password Successfully Reset - Daisy and more',
			html: `
				<!DOCTYPE html>
				<html>
				<head>
					<meta charset="UTF-8">
					<style>
						body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
						.container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
						.header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #fff; padding: 40px 30px; text-align: center; }
						.content { padding: 40px 30px; }
						.success-icon { font-size: 64px; text-align: center; margin: 20px 0; }
						.footer { background: #f9f9f9; padding: 20px; text-align: center; font-size: 13px; color: #999; }
					</style>
				</head>
				<body>
					<div class="container">
						<div class="header">
							<h1 style="margin: 0; font-size: 32px; font-weight: 300; letter-spacing: 2px;">Daisy and more</h1>
						</div>
						<div class="content">
							<div class="success-icon">✅</div>
							<h2 style="text-align: center; color: #10b981; margin: 20px 0;">Password Successfully Reset</h2>
							<p>Hello${userName ? ' ' + userName : ''},</p>
							<p>This email confirms that your password has been successfully changed.</p>
							<p>If you did not make this change, please contact our support team immediately.</p>
							<p style="margin-top: 30px;">Best regards,<br>The Daisy and more Team</p>
						</div>
						<div class="footer">
							© ${new Date().getFullYear()} Daisy and more. All rights reserved.
						</div>
					</div>
				</body>
				</html>
			`,
			text: `
Hello${userName ? ' ' + userName : ''},

This email confirms that your password has been successfully changed.

If you did not make this change, please contact our support team immediately.

Best regards,
The Daisy and more Team

© ${new Date().getFullYear()} Daisy and more. All rights reserved.
			`
		};

		const info = await transporter.sendMail(mailOptions);
		console.log('✅ Password reset confirmation email sent:', info.messageId);
		return { success: true, messageId: info.messageId };
	} catch (error) {
		console.error('❌ Error sending confirmation email:', error);
		// Ne pas throw l'erreur ici car ce n'est pas critique
		return { success: false, error: error.message };
	}
};

export default { sendPasswordResetEmail, sendPasswordResetConfirmationEmail };
