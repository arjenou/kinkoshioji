/**
 * Contact form API - 接收联系表单数据并发送邮件
 * 与 api/send.js 共用 Gmail 配置，接受表单格式 (name, email, tel, company, address, message)
 */

const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, tel, company, address, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: '名前、メールアドレス、お問い合わせ内容は必須です',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: '有効なメールアドレスを入力してください',
      });
    }

    const GMAIL_USER = process.env.GMAIL_USER || 'nbs0320@gmail.com';
    const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || 'laexwfcolhbefydo';
    const CONTACT_EMAIL = process.env.CONTACT_EMAIL || GMAIL_USER;

    const subject = `【お問い合わせ】${name}様からのお問い合わせ`;
    const text = `
お問い合わせ内容：

お名前: ${name}
メールアドレス: ${email}
電話番号: ${tel || '未入力'}
会社名: ${company || '未入力'}
住所: ${address || '未入力'}

お問い合わせ内容:
${message}

---
このメールは ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })} に送信されました。
    `.trim();

    const html = `
<h2>お問い合わせ内容</h2>
<p><strong>お名前:</strong> ${name}</p>
<p><strong>メールアドレス:</strong> ${email}</p>
<p><strong>電話番号:</strong> ${tel || '未入力'}</p>
<p><strong>会社名:</strong> ${company || '未入力'}</p>
<p><strong>住所:</strong> ${address || '未入力'}</p>
<hr>
<h3>お問い合わせ内容:</h3>
<p>${(message || '').replace(/\n/g, '<br>')}</p>
<hr>
<p><small>このメールは ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })} に送信されました。</small></p>
    `.trim();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `お問い合わせフォーム <${GMAIL_USER}>`,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject,
      text,
      html,
    });

    return res.status(200).json({
      success: true,
      message: 'お問い合わせを受け付けました。ありがとうございます。',
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'メールの送信に失敗しました。しばらくしてから再度お試しください。',
    });
  }
};
