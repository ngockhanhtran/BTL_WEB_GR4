// Hàm khởi tạo, tất cả các trang đều cần
function khoiTao() {
    // get data từ localstorage
    list_products = getListProducts() || list_products;
    
    capNhat_ThongTin_CurrentUser();
    addEventCloseAlertButton();

    // (Lưu ý: hàm này chạy khi onload, nên header đã được vẽ ra)
    setupDarkModeToggle();
}

// --- Quản lý Sản Phẩm (LocalStorage) ---

// Localstorage cho dssp: 'ListProducts'
function setListProducts(newList) {
    window.localStorage.setItem('ListProducts', JSON.stringify(newList));
}

function getListProducts() {
    return JSON.parse(window.localStorage.getItem('ListProducts'));
}

/**
 * Tìm kiếm sản phẩm theo tên.
 * @param {Array} list - Danh sách sản phẩm
 * @param {string} ten - Tên sản phẩm cần tìm
 * @returns {Array} - Danh sách sản phẩm phù hợp
 */
function timKiemTheoTen(list, ten, soluong) {
    var tempList = copyObject(list);
    var result = [];
    ten = ten.split(' ');

    for (var sp of tempList) {
        var correct = true;
        for (var t of ten) {
            if (sp.name.toUpperCase().indexOf(t.toUpperCase()) < 0) {
                correct = false;
                break;
            }
        }
        if (correct) {
            result.push(sp);
        }
    }
    return result;
}

/**
 * Tìm kiếm sản phẩm theo mã.
 * @param {Array} list - Danh sách sản phẩm
 * @param {string} ma - Mã sản phẩm
 * @returns {Object|undefined}
 */
function timKiemTheoMa(list, ma) {
    for (var l of list) {
        if (l.masp == ma) return l;
    }
}

// copy 1 object, do trong js ko có tham biến, tham trị rõ ràng
function copyObject(o) {
    return JSON.parse(JSON.stringify(o));
}

// --- Hộp thoại Thông báo (Alert Box) ---

// div có id alert được tạo trong hàm addFooter
function addAlertBox(text, bgcolor, textcolor, time) {
    var al = document.getElementById('alert');
    if (!al) return; // Thoát nếu chưa có footer

    al.childNodes[0].nodeValue = text;
    al.style.backgroundColor = bgcolor;
    al.style.opacity = 1;
    al.style.zIndex = 200;

    if (textcolor) al.style.color = textcolor;
    if (time)
        setTimeout(function () {
            al.style.opacity = 0;
            al.style.zIndex = 0;
        }, time);
}

function addEventCloseAlertButton() {
    var closeBtn = document.getElementById('closebtn');
    if (closeBtn) {
        closeBtn.addEventListener('mouseover', (event) => {
            event.target.parentElement.style.opacity = 0;
            event.target.parentElement.style.zIndex = 0;
        });
    }
}

// --- Logic Giỏ Hàng ---

// Hiệu ứng cho icon giỏ hàng
function animateCartNumber() {
    var cn = document.getElementsByClassName('cart-number')[0];
    if (!cn) return;

    cn.style.transform = 'scale(2)';
    cn.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    cn.style.color = 'white';
    setTimeout(function () {
        cn.style.transform = 'scale(1)';
        cn.style.backgroundColor = 'transparent';
        cn.style.color = 'red';
    }, 1200);
}

function themVaoGioHang(masp, tensp) {
    var user = getCurrentUser(); 
    
    var t = new Date();
    var daCoSanPham = false;

    // check trùng sản phẩm
    for (var i = 0; i < user.products.length; i++) {
        if (user.products[i].ma == masp) {
            user.products[i].soluong++;
            daCoSanPham = true;
            break;
        }
    }

    // nếu không trùng thì mới thêm sản phẩm vào user.products
    if (!daCoSanPham) {
        user.products.push({
            "ma": masp,
            "soluong": 1,
            "date": t
        });
    }

    animateCartNumber();
    addAlertBox('Đã thêm ' + tensp + ' vào giỏ.', '#17c671', '#fff', 3500);

    setCurrentUser(user); 
    capNhat_ThongTin_CurrentUser(); // cập nhật giỏ hàng
}

// Hàm get set cho người dùng hiện tại đã đăng nhập
function getCurrentUser() {
    var u = JSON.parse(window.localStorage.getItem('CurrentUser'));
    if (u == null) {
        // Tạo user "guest" mặc định
        u = {
            "username": "guest",
            "products": [],
            "donhang": []
        };
        setCurrentUser(u);
    }
    return u;
}

function setCurrentUser(u) {
    window.localStorage.setItem('CurrentUser', JSON.stringify(u));
}

// Cập nhật số lượng hàng trong giỏ hàng + Tên current user
function capNhat_ThongTin_CurrentUser() {
    var u = getCurrentUser();
    var cartNumber = document.getElementsByClassName('cart-number')[0];
    
    if (u && cartNumber) {
        // Cập nhật số lượng hàng vào header
        cartNumber.innerHTML = getTongSoLuongSanPhamTrongGioHang(u);
    }
}

// tính tổng số lượng các sản phẩm của user u truyền vào
function getTongSoLuongSanPhamTrongGioHang(u) {
    var soluong = 0;
    if (!u || !u.products) return 0;
    for (var p of u.products) {
        soluong += p.soluong;
    }
    return soluong;
}

// lấy số lương của sản phẩm NÀO ĐÓ của user NÀO ĐÓ được truyền vào
function getSoLuongSanPhamTrongUser(tenSanPham, user) {
    if (!user || !user.products) return 0;
    for (var p of user.products) {
        if (p.name == tenSanPham)
            return p.soluong;
    }
    return 0;
}

// --- Các hàm tiện ích khác ---

function numToString(num, char) {
    return num.toLocaleString().split(',').join(char || '.');
}

function stringToNum(str, char) {
    return Number(str.split(char || '.').join(''));
}

// Autocomplete cho thanh tìm kiếm
// Nguồn: https://www.w3schools.com/howto/howto_js_autocomplete.asp
function autocomplete(inp, arr) {
    var currentFocus;

    inp.addEventListener("keyup", function (e) {
        if (e.keyCode != 13 && e.keyCode != 40 && e.keyCode != 38) {
            var a, b, i, val = this.value;
            closeAllLists();
            if (!val) {
                return false;
            }
            currentFocus = -1;
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            this.parentNode.appendChild(a);

            for (i = 0; i < arr.length; i++) {
                if (arr[i].name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    b = document.createElement("DIV");
                    b.innerHTML = "<strong>" + arr[i].name.substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i].name.substr(val.length);
                    b.innerHTML += "<input type='hidden' value='" + arr[i].name + "'>";
                    b.addEventListener("click", function (e) {
                        inp.value = this.getElementsByTagName("input")[0].value;
                        inp.focus();
                        closeAllLists();
                    });
                    a.appendChild(b);
                }
            }
        }
    });

    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) { // Down
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) { // Up
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) { // Enter
            if (currentFocus > -1) {
                if (x) {
                    x[currentFocus].click();
                    e.preventDefault();
                }
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

// Thêm từ khóa tìm kiếm
function addTags(nameTag, link) {
    var new_tag = `<a href="` + link + `">` + nameTag + `</a>`;
    var khung_tags = document.getElementsByClassName('tags')[0];
    if (khung_tags) {
        khung_tags.innerHTML += new_tag;
    }
}

// Thêm sản phẩm vào trang
function addProduct(p, ele, returnString) {
    // Giả định class Promo và Product đã được định nghĩa ở file classes.js
    var promo = new Promo(p.promo.name, p.promo.value);
    var product = new Product(p.masp, p.name, p.img, p.price, p.star, p.rateCount, promo);

    return addToWeb(product, ele, returnString); // Giả định hàm addToWeb đã có
}

// --- Render HTML (document.write) ---

// Thêm topnav vào trang
function addTopNav() {
    document.write(`    
	<div class="top-nav group">
        <section>
            <div class="social-top-nav">
                <a class="fa fa-facebook"></a>
                <a class="fa fa-instagram"></a>
                <a class="fa fa-google"></a>
                <a class="fa fa-youtube"></a>
            </div> <ul class="top-nav-quicklink flexContain">
                <li><a href="../index.html"><i class="fa fa-home"></i> Trang chủ</a></li>
                <li><a href="./PhamThiThuyQuynh_241230831/tintuc.html"><i class="fa fa-newspaper-o"></i> Tin tức</a></li>
                <li><a href="./PhamThiThuyQuynh_241230831/tuyendung.html"><i class="fa fa-handshake-o"></i> Tuyển dụng</a></li>
                <li><a href="./NguyenTrungKien_241230766/gioithieu.html"><i class="fa fa-info-circle"></i> Giới thiệu</a></li>
                <li><a href="./NguyenTrungKien_241230766/trungtambaohanh.html"><i class="fa fa-wrench"></i> Bảo hành</a></li>
                <li><a href="./NguyenTrungKien_241230766/lienhe.html"><i class="fa fa-phone"></i> Liên hệ</a></li>
            </ul> </section></div>`);
}

// Thêm header
function addHeader() {
    document.write(`        
	<div class="header group">
        <div class="logo">
            <a href="../index.html">
                <img src="./img/logo.jpg" alt="Trang chủ The Mobile Zone" title="Trang chủ The Mobile Zone">
            </a>
        </div> <div class="content">
            <div class="search-header" style="position: relative; left: 162px; top: 1px;">
                <form class="input-search" method="get" action="../index.html">
                    <div class="autocomplete">
                        <input id="search-box" name="search" autocomplete="off" type="text" placeholder="Nhập từ khóa tìm kiếm...">
                        <button type="submit">
                            <i class="fa fa-search"></i>
                            Tìm kiếm
                        </button>
                    </div>
                </form> <div class="tags">
                    <strong>Từ khóa: </strong>
                </div>
            </div> <div class="tools-member">
                <div class="cart">
                    <a href="giohang.html">
                        <i class="fa fa-shopping-cart"></i>
                        <span>Giỏ hàng</span>
                        <span class="cart-number"></span>
                    </a>
                </div>
                
                <img class="dark-mode-toggle" src="./img/darkmode.png" alt="Toggle Dark Mode" title="Bật/tắt chế độ tối">
                
            </div></div> </div> `);
}

// Thêm footer
function addFooter() {
    document.write(`
    <div id="alert">
        <span id="closebtn">&otimes;</span>
    </div>

    <div class="footer-container">
        
        <div class="footer-column">
            <h3>Hỗ trợ khách hàng</h3>
            <ul>
                <li><a href="./NguyenTrungKien_241230766/trungtambaohanh.html">Trung tâm bảo hành</a></li>
                <li><a href="./NguyenTrungKien_241230766/lienhe.html">Liên hệ góp ý</a></li>
                <li><a href="./PhamThiThuyQuynh_241230831/tuyendung.html">Tuyển dụng</a></li>
                <li><a href="./NguyenTrungKien_241230766/gioithieu.html">Giới thiệu</a></li>
            </ul>
        </div>
        
        <div class="footer-column">
            <h3>Về The Mobile Zone</h3>
            <ul>
                <li><a href="../index.html">Trang chủ</a></li>
                <li><a href="./PhuongMaiAnh_241224468/sale.html">Khuyến mãi</a></li>
                <li><a href="./PhamThiThuyQuynh_241230831/tintuc.html">Tin tức công nghệ</a></li>
            </ul>
        </div>
        
        <div class="footer-column">
            <h3>Đơn vị chủ quản</h3>
            <a href="https://www.utc.edu.vn/" target="_blank" rel="noopener noreferrer">
                <img src="./img/footer/footer1.png" alt="Trường Đại học Giao thông Vận tải" class="footer-img-utc">
            </a>
        </div>
        
    </div>

    <div class="copy-right">
        <p><a href="../index.html">The Mobile Zone</a> - All rights reserved © 2025 - Designed by Group 4</p>
    </div>`);
}

// Thêm plc (phần giới thiệu trước footer)
function addPlc() {
    document.write(`
    <div class="plc">
        <section>
            <ul class="flexContain">
                <li>Giao hàng hỏa tốc trong 1 giờ</li>
                <li>Thanh toán linh hoạt: tiền mặt, visa / master, trả góp</li>
                <li>Trải nghiệm sản phẩm tại nhà</li>
                <li>Lỗi đổi tại nhà trong 1 ngày</li>
                <li>Hỗ trợ suốt thời gian sử dụng.
                    <br>Hotline:
                    <a href="tel:12345678" style="color: #288ad6;">12345678</a>
                </li>
            </ul>
        </section>
    </div>`);
}

// --- Tiện ích (còn lại) ---

// Xáo trộn mảng
// Nguồn: https://stackoverflow.com/a/2450976/11898496
function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }
    return array;
}

// Kiểm tra LocalStorage
function checkLocalStorage() {
    if (typeof (Storage) == "undefined") {
        alert('Máy tính không hỗ trợ LocalStorage. Không thể lưu thông tin sản phẩm, khách hàng!!');
    } else {
        console.log('LocaStorage OKE!');
    }
}

// Di chuyển lên đầu trang
function gotoTop() {
    if (window.jQuery) {
        jQuery('html,body').animate({
            scrollTop: 0
        }, 100);
    } else {
        var topNav = document.getElementsByClassName('top-nav')[0];
        if (topNav) {
            topNav.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }
}

// Lấy màu ngẫu nhiên
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function setupDarkModeToggle() {
    var toggleButton = document.querySelector('.dark-mode-toggle');
    if (!toggleButton) return;

    // Thêm sự kiện click cho nút
    toggleButton.addEventListener('click', function() {
        // Thêm/xóa class 'dark' trên thẻ <html> (chứ không phải <body>)
        document.documentElement.classList.toggle('dark');

        // Lưu lựa chọn vào localStorage
        if (document.documentElement.classList.contains('dark')) {
            localStorage.setItem('darkmode', 'enabled');
        } else {
            localStorage.setItem('darkmode', 'disabled');
        }
    });
}