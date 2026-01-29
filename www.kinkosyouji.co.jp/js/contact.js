/**
 * Contact form submission handler
 * Sends form data to Cloudflare Workers API
 */

const API_URL = 'https://api.kinkoshioji.co.jp';

$(document).ready(function() {
  // 查找联系表单（优先使用ID，如果没有则查找包含postmail的action）
  const contactForm = $('#contact-form').length > 0 
    ? $('#contact-form') 
    : $('form[action*="postmail"]');
  
  if (contactForm.length === 0) {
    console.error('Contact form not found');
    return;
  }

  // 确保表单action是安全的（双重保护）
  contactForm.attr('action', 'javascript:void(0);');
  contactForm.attr('onsubmit', 'return false;');
  
  // 确保阻止默认提交行为
  contactForm.off('submit').on('submit', async function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    
    // Get form data
    const formData = {
      name: $('input[name="name"]').val() || '',
      email: $('input[name="email"]').val() || '',
      tel: $('input[name="tel"]').val() || '',
      company: $('input[name="company"]').val() || '',
      address: $('input[name="address"]').val() || '',
      message: $('textarea[name="お問い合わせ内容"]').val() || ''
    };

    // Validate required fields
    if (!formData.name.trim()) {
      alert('お名前を入力してください。');
      $('input[name="name"]').focus();
      return;
    }

    if (!formData.email.trim()) {
      alert('メールアドレスを入力してください。');
      $('input[name="email"]').focus();
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('有効なメールアドレスを入力してください。');
      $('input[name="email"]').focus();
      return;
    }

    if (!formData.message.trim()) {
      alert('お問い合わせ内容を入力してください。');
      $('textarea[name="お問い合わせ内容"]').focus();
      return;
    }

    // Disable submit button and show loading
    const submitButton = contactForm.find('input[type="submit"]');
    const originalValue = submitButton.val();
    submitButton.prop('disabled', true).val('送信中...');

    // Show loading message
    let loadingMessage = $('<div id="contact-loading" style="text-align: center; padding: 20px; color: #0066cc; font-weight: bold;">送信しています...</div>');
    contactForm.after(loadingMessage);

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      // Remove loading message
      $('#contact-loading').remove();

      if (response.ok && result.success) {
        // Success
        alert('お問い合わせを受け付けました。ありがとうございます。\n担当者よりご連絡させていただきます。');
        contactForm[0].reset();
      } else {
        // Error
        const errorMessage = result.error || 'メールの送信に失敗しました。しばらくしてから再度お試しください。';
        alert('エラー: ' + errorMessage);
      }
    } catch (error) {
      // Remove loading message
      $('#contact-loading').remove();
      
      console.error('Contact form error:', error);
      alert('ネットワークエラーが発生しました。インターネット接続を確認してから再度お試しください。');
    } finally {
      // Re-enable submit button
      submitButton.prop('disabled', false).val(originalValue);
    }
  });
});
