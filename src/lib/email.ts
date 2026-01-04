import nodemailer from 'nodemailer';

interface EmailData {
  name: string;
  email: string;
  company?: string;
  service: string;
  message: string;
}

// Create a transporter
// For production, use real SMTP credentials via environment variables
const createTransporter = () => {
  // Check if we have SMTP configuration
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // For development, use console logging instead
  return null;
};

export async function sendEmail(data: EmailData): Promise<void> {
  const transporter = createTransporter();

  const serviceLabel = getServiceLabel(data.service);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background-color: #0f172a; padding: 32px; border-radius: 16px 16px 0 0;">
          <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 700;">
            ALLONE
          </h1>
          <p style="margin: 8px 0 0; color: #94a3b8; font-size: 14px;">
            New Contact Form Submission
          </p>
        </div>

        <div style="background-color: white; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <h2 style="margin: 0 0 24px; color: #0f172a; font-size: 20px; font-weight: 600;">
            Contact Details
          </h2>

          <div style="margin-bottom: 20px;">
            <p style="margin: 0 0 4px; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">
              Name
            </p>
            <p style="margin: 0; color: #0f172a; font-size: 16px; font-weight: 500;">
              ${escapeHtml(data.name)}
            </p>
          </div>

          <div style="margin-bottom: 20px;">
            <p style="margin: 0 0 4px; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">
              Email
            </p>
            <p style="margin: 0;">
              <a href="mailto:${escapeHtml(data.email)}" style="color: #06b6d4; font-size: 16px; text-decoration: none;">
                ${escapeHtml(data.email)}
              </a>
            </p>
          </div>

          ${data.company ? `
          <div style="margin-bottom: 20px;">
            <p style="margin: 0 0 4px; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">
              Company
            </p>
            <p style="margin: 0; color: #0f172a; font-size: 16px;">
              ${escapeHtml(data.company)}
            </p>
          </div>
          ` : ''}

          <div style="margin-bottom: 20px;">
            <p style="margin: 0 0 4px; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">
              Service Interest
            </p>
            <p style="margin: 0; color: #0f172a; font-size: 16px;">
              ${escapeHtml(serviceLabel)}
            </p>
          </div>

          <div style="margin-bottom: 0; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0 0 8px; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">
              Message
            </p>
            <p style="margin: 0; color: #0f172a; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">
              ${escapeHtml(data.message)}
            </p>
          </div>
        </div>

        <p style="margin: 24px 0 0; color: #94a3b8; font-size: 12px; text-align: center;">
          This email was sent from the ALLONE website contact form.
        </p>
      </div>
    </body>
    </html>
  `;

  const textContent = `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
${data.company ? `Company: ${data.company}\n` : ''}Service Interest: ${serviceLabel}

Message:
${data.message}

---
This email was sent from the ALLONE website contact form.
  `;

  if (transporter) {
    // Send actual email in production
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"ALLONE Website" <noreply@allone.ai>',
      to: process.env.CONTACT_EMAIL || 'hello@allone.ai',
      replyTo: data.email,
      subject: `New Contact: ${data.name} - ${serviceLabel}`,
      text: textContent,
      html: htmlContent,
    });
  } else {
    // Log to console in development
    console.log('\n========== NEW CONTACT FORM SUBMISSION ==========');
    console.log('Name:', data.name);
    console.log('Email:', data.email);
    if (data.company) console.log('Company:', data.company);
    console.log('Service:', serviceLabel);
    console.log('Message:', data.message);
    console.log('=================================================\n');
  }
}

function getServiceLabel(serviceId: string): string {
  const services: Record<string, string> = {
    chatbots: 'AI Chatbots & Assistants',
    automation: 'Workflow Automation',
    custom: 'Custom AI Solutions',
    consulting: 'AI Strategy & Consulting',
    other: 'Other / Not Sure',
  };
  return services[serviceId] || serviceId || 'Not specified';
}

function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}
