# MES — giao diện gốc trong một file

Chỉ gửi `MES-Demo.html`. Nhấp đúp mở trực tiếp trong Chrome/Edge, không cần cài đặt, máy chủ hay kết nối mạng.

Bản này dùng lại thành phần giao diện gốc: Rework, Sorting, chi tiết lệnh và các tab, xuất vật tư, nghiệm thu/hoàn thành, ghi nhận lỗi, đổi máy và kết thúc ca. Dữ liệu là mẫu trong bộ nhớ, không có backend hoặc ghi nhận nghiệp vụ thật. Tải lại để khôi phục mẫu.

CSS, JavaScript và icon SVG được nhúng vào HTML. React được đóng gói sẵn để giữ đúng giao diện và tương tác bên trong; người nhận không cần cài React. Không tải font bên ngoài, dùng font hệ thống dự phòng nên nét chữ có thể khác bản dùng Google Fonts.

## Dựng lại sau khi sửa giao diện

Chạy `npm ci`, sau đó `npm run build`. Script `scripts/build-single.mjs` đóng gói trực tiếp các thành phần trong `src/` vào `MES-Demo.html`, đổi điều hướng sang hash để mở được từ file. Không sửa thủ công HTML sinh ra. Entry riêng bỏ các provider tài khoản/toast không dùng cho trạm.

Bản tối giản 14,7 KB đã được thay thế bằng bản giữ đầy đủ giao diện bên trong.

## Sửa giao diện React

Chạy `npm run dev` và mở `http://127.0.0.1:5173/` để xem mã nguồn hiện tại. `MES-Demo.html` là bản đóng gói trước đó, không tự cập nhật theo thay đổi trong `src/`.

Màn hình đổi máy mới ở `src/features/station/components/modals/ChangeMachineModal.jsx`, CSS đi kèm trong `change-machine.css`. Màn hình có dữ liệu tổ/thành viên mẫu, chọn thiết bị rồi xác nhận lên ca. Nút đăng nhập lại chỉ đặt lại chọn thiết bị trong bản demo, chưa tích hợp đăng nhập thật.

## Máy sản xuất thường

Mở `http://127.0.0.1:5173/production` hoặc chọn `HN-BE-TC01 · Máy bế thủ công 1800` trong màn hình đổi máy. Mã nguồn nằm trong `src/features/production/`, chuyển từ file tham khảo `hoan-thanh-nvl.html` sang React JSX; không nhúng iframe hoặc chạy script HTML cũ.

`ProductionStationPage.jsx` chứa bảng lệnh và thao tác máy thường. `components/CompleteProductionModal.jsx` chứa các tab Thông tin chung / Khai báo lỗi, hoàn thành một phần/toàn bộ. `ProductionErrorRows.jsx` dùng chung cho bảng lỗi chung và từng NVL. `data/demoProduction.js` chứa dữ liệu mẫu. CSS được giới hạn trong `.production-station` để không thay đổi màn hình Rework/Sorting.

Các thao tác là demo trong bộ nhớ. Lấy vật liệu, hoàn vật tư và vận hành máy hiện thông báo mô phỏng; chưa có chứng từ kho/API. File `MES-Demo.html` chưa được đóng gói lại với màn hình mới.
