/**
 * Contact form submission handler
 * Sends form data to same-origin /api/contact (Vercel Serverless)
 */

// 使用同源 API，避免 404（不依赖 Cloudflare Workers）
const API_URL = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';

/** 在表单下部显示提示（成功为绿色，失败为红色），不弹框 */
function showContactMessage(text, isSuccess) {
  var $msg = $('#contact-message');
  $msg.html(text).removeClass('contact-message-success contact-message-error');
  $msg.addClass(isSuccess ? 'contact-message-success' : 'contact-message-error');
  $msg.css({
    'display': 'block',
    'background-color': isSuccess ? '#e8f5e9' : '#ffebee',
    'color': isSuccess ? '#2e7d32' : '#c62828',
    'border': '1px solid ' + (isSuccess ? '#a5d6a7' : '#ef9a9a')
  });
  $msg.show();
}

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

    // 隐藏之前的提示
    $('#contact-message').hide().removeClass('contact-message-success contact-message-error').empty();

    // Validate required fields
    if (!formData.name.trim()) {
      showContactMessage('お名前を入力してください。', false);
      $('input[name="name"]').focus();
      return;
    }

    if (!formData.email.trim()) {
      showContactMessage('メールアドレスを入力してください。', false);
      $('input[name="email"]').focus();
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showContactMessage('有効なメールアドレスを入力してください。', false);
      $('input[name="email"]').focus();
      return;
    }

    if (!formData.message.trim()) {
      showContactMessage('お問い合わせ内容を入力してください。', false);
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
      const response = await fetch(`${API_URL || ''}/api/contact`, {
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
        // Success - 在页面下部显示提示，不弹框
        contactForm[0].reset();
        showContactMessage('お問い合わせを受け付けました。ありがとうございます。<br>担当者よりご連絡させていただきます。', true);
        $('html, body').animate({ scrollTop: $('#contact-message').offset().top - 80 }, 400);
      } else {
        // Error
        const errorMessage = result.error || 'メールの送信に失敗しました。しばらくしてから再度お試しください。';
        showContactMessage(errorMessage, false);
      }
    } catch (error) {
      // Remove loading message
      $('#contact-loading').remove();
      console.error('Contact form error:', error);
      showContactMessage('ネットワークエラーが発生しました。インターネット接続を確認してから再度お試しください。', false);
    } finally {
      // Re-enable submit button
      submitButton.prop('disabled', false).val(originalValue);
    }
  });
});
