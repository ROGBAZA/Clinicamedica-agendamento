const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust this to your specific domain in production if needed
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Debugging: Check if env vars are present (do not log values)
  if (!process.env.EMAIL_USER) {
    return res.status(500).json({ error: 'Configuration Error', details: 'EMAIL_USER environment variable is missing.' });
  }
  if (!process.env.EMAIL_PASS) {
    return res.status(500).json({ error: 'Configuration Error', details: 'EMAIL_PASS environment variable is missing.' });
  }

  const { name, phone, date, message } = req.body;

  if (!name || !phone || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'bazanrogerarayala@gmail.com',
      subject: `Novo Agendamento: ${name}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #333333; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <div style="background-color: #0077b6; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; color: #ffffff;">MediCare<span style="color: #caf0f8;">Saúde</span></h1>
            <p style="margin: 5px 0 0; font-size: 14px; color: #caf0f8;">Novo Agendamento Recebido</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 25px;">
              <p style="margin: 0 0 20px; font-size: 16px; color: #023e8a; font-weight: bold; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">Detalhes do Paciente</p>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #6c757d; font-size: 14px;">Nome</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #212529; font-weight: bold; text-align: right;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #6c757d; font-size: 14px;">Telefone</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #212529; font-weight: bold; text-align: right;">${phone}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #6c757d; font-size: 14px;">Data Preferida</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #0077b6; font-weight: bold; text-align: right;">${date}</td>
                </tr>
              </table>

              <div style="margin-top: 25px;">
                <p style="margin: 0 0 10px; font-size: 14px; color: #6c757d;">Mensagem Adicional:</p>
                <div style="background-color: #ffffff; border: 1px solid #dee2e6; border-radius: 4px; padding: 15px; color: #495057; font-size: 14px; line-height: 1.5; font-style: italic;">
                  "${message || 'Nenhuma mensagem fornecida.'}"
                </div>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="tel:${phone}" style="display: inline-block; background-color: #0077b6; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Ligar para Paciente</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
            <p style="margin: 0; font-size: 12px; color: #6c757d;">&copy; 2024 MediCare Saúde. Mensagem automática do sistema.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
}
