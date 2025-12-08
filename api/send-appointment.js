import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, phone, date, message, cpf, address } = req.body;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({ error: 'Server configuration error: Missing email credentials' });
  }

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
            <div style="font-family: 'Courier New', monospace; background-color: #000; color: #00f3ff; padding: 20px; border: 1px solid #00f3ff; max-width: 600px; margin: 0 auto;">
                <h2 style="text-align: center; border-bottom: 2px solid #00f3ff; padding-bottom: 10px; text-shadow: 0 0 10px #00f3ff;">NOVO AGENDAMENTO RECEBIDO</h2>
                <div style="margin-top: 20px;">
                    <p><strong style="color: #ff00ff;">PACIENTE:</strong> ${name}</p>
                    <p><strong style="color: #ff00ff;">CPF:</strong> ${cpf}</p>
                    <p><strong style="color: #ff00ff;">CONTATO:</strong> ${phone}</p>
                    <p><strong style="color: #ff00ff;">ENDEREÇO:</strong> ${address}</p>
                    <p><strong style="color: #ff00ff;">DATA/HORA:</strong> ${date}</p>
                    <p><strong style="color: #ff00ff;">MENSAGEM:</strong></p>
                    <div style="border: 1px dashed #39ff14; padding: 10px; color: #39ff14;">
                        ${message}
                    </div>
                </div>
                <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #555;">
                    <p>SISTEMA AUTOMATIZADO MEDICARE.AI</p>
                </div>
            </div>
        `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Error sending email', details: error.message });
  }
}
