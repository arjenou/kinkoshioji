/**
 * Gmail SMTP Mail Service
 * 直接使用 Gmail 应用密钥发送邮件
 */

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// Gmail SMTP 配置（从环境变量读取）
const GMAIL_USER = process.env.GMAIL_USER || 'nbs0320@gmail.com';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || 'laexwfcolhbefydo';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || GMAIL_USER;

// 创建 Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD, // 使用应用密钥，不是普通密码
  },
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'gmail-mail-service' });
});

// 发送邮件端点
app.post('/send', async (req, res) => {
  try {
    const { to, replyTo, subject, text, html, formData } = req.body;

    // 验证必填字段
    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({
        success: false,
        error: '缺少必填字段：to, subject, text 或 html',
      });
    }

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

    res.json({
      success: true,
      messageId: info.messageId,
      message: 'メールが正常に送信されました',
    });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'メールの送信に失敗しました',
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Gmail Mail Service running on port ${PORT}`);
  console.log(`Gmail User: ${GMAIL_USER}`);
  console.log(`Contact Email: ${CONTACT_EMAIL}`);
});
