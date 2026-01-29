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

    // 公司信息
    const COMPANY_NAME = '金興商事株式会社';
    const COMPANY_ADDRESS = '〒264-0031 千葉市若葉区愛生町49-7';
    const COMPANY_TEL = '043-239-7333';
    const COMPANY_FAX = '043-239-7336';

    // 1. 发送给管理员（内部通知）
    await transporter.sendMail({
      from: `お問い合わせフォーム <${GMAIL_USER}>`,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject,
      text,
      html,
    });

    // 2. 发送给填表人（确认邮件，包含公司信息）
    const confirmationSubject = '【金興商事株式会社】お問い合わせありがとうございます';
    const confirmationText = `
${name} 様

この度は、金興商事株式会社にお問い合わせいただき、誠にありがとうございます。

以下の内容でお問い合わせを受け付けました。
担当者より、ご入力いただいたメールアドレスまたは電話番号にご連絡させていただきます。

【お問い合わせ内容】
お名前: ${name}
メールアドレス: ${email}
電話番号: ${tel || '未入力'}
会社名: ${company || '未入力'}
住所: ${address || '未入力'}

お問い合わせ内容:
${message}

---
【金興商事株式会社】
${COMPANY_ADDRESS}
TEL: ${COMPANY_TEL}
FAX: ${COMPANY_FAX}

このメールは自動送信されています。本メールへの返信はできません。
お問い合わせは、上記の電話番号までご連絡ください。
    `.trim();

    const confirmationHtml = `
<div style="font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif; line-height: 1.8; color: #333;">
  <p>${name} 様</p>
  
  <p>この度は、<strong>金興商事株式会社</strong>にお問い合わせいただき、誠にありがとうございます。</p>
  
  <p>以下の内容でお問い合わせを受け付けました。<br>
  担当者より、ご入力いただいたメールアドレスまたは電話番号にご連絡させていただきます。</p>
  
  <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
    <h3 style="margin-top: 0; color: #0066cc;">【お問い合わせ内容】</h3>
    <p><strong>お名前:</strong> ${name}</p>
    <p><strong>メールアドレス:</strong> ${email}</p>
    <p><strong>電話番号:</strong> ${tel || '未入力'}</p>
    <p><strong>会社名:</strong> ${company || '未入力'}</p>
    <p><strong>住所:</strong> ${address || '未入力'}</p>
    <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;">
    <p><strong>お問い合わせ内容:</strong></p>
    <p style="white-space: pre-wrap;">${(message || '').replace(/\n/g, '<br>')}</p>
  </div>
  
  <hr style="border: none; border-top: 2px solid #0066cc; margin: 30px 0;">
  
  <div style="background-color: #e8f4f8; padding: 20px; border-radius: 8px; margin-top: 30px;">
    <h3 style="margin-top: 0; color: #0066cc;">【金興商事株式会社】</h3>
    <p style="margin: 5px 0;"><strong>住所:</strong> ${COMPANY_ADDRESS}</p>
    <p style="margin: 5px 0;"><strong>TEL:</strong> ${COMPANY_TEL}</p>
    <p style="margin: 5px 0;"><strong>FAX:</strong> ${COMPANY_FAX}</p>
  </div>
  
  <p style="margin-top: 30px; font-size: 12px; color: #666;">
    このメールは自動送信されています。本メールへの返信はできません。<br>
    お問い合わせは、上記の電話番号までご連絡ください。
  </p>
</div>
    `.trim();

    await transporter.sendMail({
      from: `${COMPANY_NAME} <${GMAIL_USER}>`,
      to: email,
      subject: confirmationSubject,
      text: confirmationText,
      html: confirmationHtml,
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
