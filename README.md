Đây là dự án Bài tập lớn của Nhóm 4, xây dựng một trang web thương mại điện tử chuyên bán điện thoại di động (The Mobile Zone).

Giao diện được thiết kế thân thiện, trực quan, dễ sử dụng và có đầy đủ các chức năng của một trang bán hàng cơ bản.


## Chức năng Nổi bật:

- **Trang chủ tự động**:
    + Sản phẩm Nổi bật
    + Sản phẩm Mới
    + Khuyến mãi Trả góp 0%
    + Giá sốc Online

- **Banner Quảng cáo**: Sử dụng thư viện OwlCarousel để tạo thanh trượt banner mượt mà.

- **Bộ lọc & Sắp xếp**:
    + Cho phép lọc sản phẩm theo Hãng, Mức giá, Khuyến mãi, và Số sao đánh giá.
    + Cho phép sắp xếp sản phẩm theo Giá (tăng/giảm), Đánh giá, Sao, và Tên (A-Z, Z-A).
    + Tất cả logic lọc/sắp xếp được thực hiện ngay trên trình duyệt (client-side) bằng JavaScript.

- **Tìm kiếm thông minh**: Tích hợp ô tìm kiếm có chức năng autocomplete (gợi ý tự động) khi người dùng gõ.

- **Giỏ hàng**: Cài không cần đăng nhập 
    + Người dùng có thể thêm, xóa, thay đổi số lượng sản phẩm trong giỏ.
    + Dữ liệu giỏ hàng được lưu trữ cục bộ bằng localStorage để không bị mất khi tải lại trang.

- **Trang Chi tiết Sản phẩm**:
    + Hiển thị đầy đủ thông số kỹ thuật, giá, và các chính sách bảo hành, khuyến mãi.
    + Tích hợp thuật toán gợi ý sản phẩm tương tự dựa trên các tiêu chí (hãng, mức giá, thông số).

- **Trang Sale (Khuyến mãi)**:
    + Một trang landing page riêng cho sự kiện (Black Friday).
    + Tích hợp đồng hồ đếm ngược (countdown timer) và popup chi tiết thể lệ chương trình.

- **Giao diện Dark Mode**: Hỗ trợ chuyển đổi giao diện Tối/Sáng trên toàn bộ các trang, và lưu lựa chọn của người dùng vào localStorage.

- **Các trang tĩnh**: Bao gồm các trang Tin tức, Giới thiệu, Liên hệ (có form validation), và Trung tâm Bảo hành.


## Công nghệ & Kỹ thuật sử dụng:
- **HTML5 & CSS3**: Sử dụng các thẻ HTML5 ngữ nghĩa và các kỹ thuật CSS3 hiện đại.

- **Responsive Design**: Giao diện được tùy chỉnh (@media queries) để hiển thị tốt trên mọi kích thước màn hình, từ điện thoại di động, máy tính bảng đến máy tính để bàn.

- **JavaScript**:
    + Xây dựng toàn bộ logic của trang web (lọc, sắp xếp, giỏ hàng, gợi ý sản phẩm) bằng JavaScript thuần.
    + Dữ liệu sản phẩm được quản lý tập trung tại data/products.js.
    + Sử dụng localStorage để lưu trữ dữ liệu giỏ hàng và trạng thái Dark Mode.
    + Cấu trúc code dạng module, tái sử dụng HTML (Header, Footer, TopNav) bằng cách chèn qua document.write().

- **jQuery (v3.3.1)**: Được sử dụng làm thư viện nền để thao tác DOM và là yêu cầu bắt buộc cho thư viện OwlCarousel.

- **OwlCarousel (v2.3.4)**: Thư viện được sử dụng để tạo tất cả các thanh trượt (slider/carousel) trong dự án (banner, sản phẩm sale, ảnh chi tiết sản phẩm).

