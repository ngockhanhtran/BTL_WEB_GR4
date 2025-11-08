(function() {
	// Lấy trạng thái dark mode từ localStorage
	const isDarkMode = localStorage.getItem('darkmode') === 'enabled';

	// Nếu là dark mode, thêm class 'dark' vào thẻ <html>
	if (isDarkMode) {
		document.documentElement.classList.add('dark');
	}
})();