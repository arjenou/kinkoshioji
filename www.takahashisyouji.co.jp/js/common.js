// スムーズスクロール
$(function() {
	$('#pagetop').click(function () {
		$("html,body").animate({scrollTop:0},"300");
	});
	$('#pagetop').hide();
		$(window).scroll(function () {
			if($(window).scrollTop() > 500) {
				$('#pagetop').slideDown(100);
			} else {
				$('#pagetop').slideUp(100);
			}
		});
});

