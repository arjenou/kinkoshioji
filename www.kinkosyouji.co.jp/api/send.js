/**
 * Vercel Serverless Function for Gmail SMTP
 * 直接使用 Gmail 应用密钥发送邮件
 */

const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理 OPTIONS 请求（CORS preflight）
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 从环境变量获取配置
    const GMAIL_USER = process.env.GMAIL_USER || 'nbs0320@gmail.com';
    const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || 'laexwfcolhbefydo';
    const CONTACT_EMAIL = process.env.CONTACT_EMAIL || GMAIL_USER;

    // 获取请求数据
    const { to, replyTo, subject, text, html, formData } = req.body;

    // 验证必填字段
    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({
        success: false,
        error: '缺少必填字段：to, subject, text 或 html',
      });
    }

    // 创建 Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD, // 使用应用密钥
      },
    });

    // 准备邮件内容
    const mailOptions = {
      from: `お問い合わせフォーム <${GMAIL_USER}>`,
      to: to,
      replyTo: replyTo || GMAIL_USER,
      subject: subject,
      text: text,
      html: html || text.replace(/\n/g, '<br>'),
    };

    // 发送邮件
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.messageId);

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      message: 'メールが正常に送信されました',
    });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'メールの送信に失敗しました',
    });
  }
};
