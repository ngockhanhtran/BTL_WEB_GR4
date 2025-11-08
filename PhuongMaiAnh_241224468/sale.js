/* --- JS cho đồng hồ đếm ngược --- */
function startCountdown(targetDate) {
    var countdownElement = document.getElementById('countdown-timer');
    if (!countdownElement) return;

    var daysEl = document.getElementById('days');
    var hoursEl = document.getElementById('hours');
    var minutesEl = document.getElementById('minutes');
    var secondsEl = document.getElementById('seconds');

    var interval = setInterval(function() {
        var now = new Date().getTime();
        var distance = targetDate - now;

        /* Tính toán thời gian */
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        /* Hiển thị (thêm số 0 nếu < 10) */
        daysEl.innerHTML = days < 10 ? '0' + days : days;
        hoursEl.innerHTML = hours < 10 ? '0' + hours : hours;
        minutesEl.innerHTML = minutes < 10 ? '0' + minutes : minutes;
        secondsEl.innerHTML = seconds < 10 ? '0' + seconds : seconds;

        /* Khi hết hạn */
        if (distance < 0) {
            clearInterval(interval);
            document.querySelector('.countdown-container h3').innerHTML = "SỰ KIỆN ĐANG DIỄN RA!";
            daysEl.innerHTML = "00";
            hoursEl.innerHTML = "00";
            minutesEl.innerHTML = "00";
            secondsEl.innerHTML = "00";
        }
    }, 1000);
}

/* --- Chạy mọi thứ khi trang tải xong --- */
window.onload = function () {
    khoiTao(); /* Chạy hàm khởi tạo chung từ file dungchung.js */

    // thêm tags (từ khóa) vào khung tìm kiếm
    var tags = ["Samsung", "iPhone", "Huawei", "Oppo", "Xiaomi"];
    for (var t of tags) addTags(t, "index.html?search=" + t);
    
    /* --- BẮT ĐẦU ĐẾM NGƯỢC --- */
    var blackFridayDate = new Date("Nov 28, 2025 00:00:00").getTime();
    startCountdown(blackFridayDate);
    
    /* --- TẢI SẢN PHẨM --- */
    var productsContainer = document.getElementById('sale-product-list');
    
    /* Thêm kiểm tra xem list_products có tồn tại không */
    if(productsContainer && typeof list_products !== 'undefined') {
        var saleProducts = [];

        /* Lọc các sản phẩm có khuyến mãi "giamgia" */
        for(var p of list_products) {
            if(p.promo.name === 'giamgia') {
                saleProducts.push(p);
            }
        }

        /* Nếu không có sản phẩm "giamgia" nào, lấy tạm 10 SP đầu tiên */
        if(saleProducts.length === 0) {
            saleProducts = list_products.slice(0, 10);
        }

        /* Thêm sản phẩm vào HTML */
        for(var p of saleProducts) {
            addProduct(p, productsContainer); /* Hàm addProduct từ dungchung.js */
        }

		/* Thêm nút bấm sang trái phải */
		var owl = $(productsContainer); // Dùng jQuery để chọn
		owl.owlCarousel({
			items: 5, // Hiển thị 5 sản phẩm trên màn hình lớn
			margin: 10,
			loop: true,
			smartSpeed: 450,
			autoplay: true,
			autoplayTimeout: 3000,
			nav: true, /* THÊM DÒNG NÀY ĐỂ BẬT NÚT BẤM */
			responsive: { // Giúp hiển thị đẹp trên mọi kích cỡ màn hình
				0: {
					items: 2 // 2 sản phẩm trên điện thoại
				},
				600: {
					items: 3 // 3 sản phẩm trên máy tính bảng
				},
				1000: {
					items: 5 // 5 sản phẩm trên máy tính
				}
			}
		});

    }


    /* JAVASCRIPT ĐỂ ĐIỀU KHIỂN POPUP                 */
    
    /* 1. "Gọi tên" các phần tử HTML mình cần dùng */
    var openBtn = document.getElementById('openModalBtn');     /* Nút để mở */
    var modal = document.getElementById('myModal');           /* Khung popup */
    var overlay = document.getElementById('myModalOverlay');  /* Lớp nền mờ */
    
    /* Dùng querySelector để tìm nút close BÊN TRONG modal */
    var closeBtn = document.querySelector('#myModal .modal-close'); 

    /* 2. Viết 2 hàm (chức năng) để Bật và Tắt popup */
    function showModal() {
        if(modal && overlay) {
            modal.classList.add('show');
            overlay.classList.add('show');
        }
    }

    function closeModal() {
        if(modal && overlay) {
            modal.classList.remove('show');
            overlay.classList.remove('show');
        }
    }

    /* 3. Bắt sự kiện: "Ai bấm vào đâu thì làm gì" */
    
    /* Bấm vào nút "Xem chi tiết" */
    if(openBtn) {
        openBtn.onclick = showModal;  
    }
    
    /* Bấm vào dấu X */
    if(closeBtn) {
        closeBtn.onclick = closeModal; 
    }
    
    /* Bấm ra ngoài nền mờ */
    if(overlay) {
        overlay.onclick = closeModal;  
    }

};