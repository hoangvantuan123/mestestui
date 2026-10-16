from pathlib import Path
base = Path(__file__).parent
exec((base/'build_doc.py').read_text(encoding='utf-8').split("d.add_paragraph('Quy trình xử lý Rework và Sorting")[0])
d.styles['Heading 3'].font.name='Arial'
d.styles['Heading 3'].font.size=Pt(11)
d.styles['Heading 3'].font.color.rgb=RGBColor(0,0,0)
def h(t): d.add_heading(t, 2 if t.startswith(('1 ', '2 ')) else 3)

def note(t):
    para=d.add_paragraph()
    para.add_run('Chú ý: ').bold=True
    para.add_run(t)

def image_slot(n, caption, height=5):
    para=d.add_paragraph()
    para.add_run(f'Hình {n}  {caption}').bold=True
    para.paragraph_format.keep_with_next=True
    para=d.add_paragraph(f'[CHÈN ẢNH {n} TẠI ĐÂY]')
    para.alignment=1
    para.paragraph_format.space_before=Pt(12)
    para.paragraph_format.space_after=Pt(height*28.35)
    r=para.runs[0]; r.italic=True; r.font.color.rgb=RGBColor(110,110,110)

d.add_paragraph('Quy trình xử lý Rework và Sorting trên MES và BRAVO','Title')
p('Luồng hoạt động từ tạo lệnh đến xuất chuyển mã')
d.add_heading('1 Rework',1)
h('1 1 Phạm vi và luồng tổng quát')
p('Quy trình áp dụng cho nhóm Rework, gồm 8A Rework nội bộ và 8B Rework hàng bán bị trả lại để bán lại theo RMA. Nhóm Sorting 7A và 7B được lập thành quy trình riêng.')
h('Luồng hoạt động')
for t in ['1. BRAVO tạo lệnh công đoạn Rework.',
'2. MES đồng bộ lệnh về MES Admin và MES xưởng.',
'3. Người vận hành truy cập máy đại diện Rework, thực hiện Lấy NVL.',
'4. MES đẩy phiếu đề nghị xuất kho lên BRAVO.',
'5. Trên BRAVO, sử dụng đề nghị xuất để điều chuyển từ kho chính sang kho phân xưởng.',
'6. Thực hiện Rework; kiểm tra tồn kho phân xưởng trước khi thống kê và hoàn thành lệnh trên MES.',
'7. MES đẩy kết quả hoàn thành lên BRAVO; BRAVO tự động sinh phiếu xuất chuyển mã.']: p(t)
note('Các trường được nêu ở từng bước cần được đẩy đúng giữa MES và BRAVO theo lệnh và khai báo Rework.')

d.add_page_break(); h('1 2 Tạo lệnh và đồng bộ sang MES')
h('Bước 1 Tạo lệnh công đoạn trên BRAVO')
p('Tạo lệnh công đoạn thuộc 8A hoặc 8B trên BRAVO và đăng ký mã vật tư chính của lệnh Rework.')
h('Bước 2 Đồng bộ lệnh về MES')
p('MES đồng bộ lệnh từ BRAVO về MES Admin và MES xưởng. Người vận hành truy cập máy đại diện Rework để thực hiện Lấy NVL và Thống kê theo lệnh.')
note('Cần đồng bộ đúng lệnh và mã vật tư chính từ BRAVO về MES Admin và MES xưởng.')
image_slot(1,'Lệnh công đoạn Rework trên BRAVO',4.5)
image_slot(2,'Lệnh trên MES và máy đại diện Rework',4.5)

d.add_page_break(); h('1 3 Lấy NVL và đẩy đề nghị xuất kho')
h('Bước 3 Lấy NVL trên MES')
p('Tại máy đại diện Rework, chọn lệnh và thực hiện Lấy NVL. MES đẩy phiếu đề nghị xuất kho lên BRAVO.')
h('Đầu phiếu đề nghị xuất kho trên BRAVO')
table(['Mục','Chú ý cần đẩy đúng'],[
('4 Đối tượng','Cần đẩy đúng đối tượng của lệnh.'),
('6 Công đoạn','Cần đẩy đúng CDRE thuộc nhóm Rework.'),
('7 Loại xuất','Cần đẩy đúng X01 — Xuất theo lệnh.'),
('9 Kho nhập','Cần tự động đẩy đúng kho phân xưởng.')],[4,13])
h('Chi tiết đề nghị xuất kho')
p('Đề nghị xuất sử dụng chính mã vật tư Rework của lệnh, không lấy danh sách NVL trong BOM.')
note('Cần đẩy đúng mã vật tư Rework và kho xuất. Nhớ kiểm tra tồn của mã vật tư tại kho xuất trước khi điều chuyển.')
image_slot(3,'Phiếu đề nghị xuất kho trên BRAVO gồm đầu phiếu và chi tiết',6)

d.add_page_break(); h('1 4 Điều chuyển vật tư sang kho phân xưởng')
h('Bước 4 Điều chuyển kho trên BRAVO')
p('Sau khi MES lấy NVL thành công và phiếu đề nghị xuất kho đã có trên BRAVO, sử dụng phiếu đề nghị xuất để thực hiện điều chuyển vật tư từ kho chính sang kho phân xưởng phục vụ Rework.')
p('Luồng vật tư: Kho chính → Kho phân xưởng → Thực hiện Rework.')
note('Cần dùng đúng mã vật tư Rework, đúng kho xuất và đúng kho phân xưởng nhận. Kiểm tra tồn kho xuất và kết quả điều chuyển trước khi thực hiện hoàn thành lệnh.')
image_slot(4,'Chứng từ điều chuyển từ kho chính sang kho phân xưởng',7)

d.add_page_break(); h('1 5 Thống kê và hoàn thành lệnh trên MES')
h('Bước 5 Thực hiện Rework')
p('Phân xưởng thực hiện Rework theo lệnh. Sau khi xử lý, người vận hành thực hiện Thống kê và Hoàn thành lệnh trên MES tại máy đại diện Rework.')
h('Bước 6 Kiểm tra tồn trước khi hoàn thành')
note('Trước khi bấm Hoàn thành lệnh, cần bảo đảm còn đủ tồn của đúng mã hàng tại kho phân xưởng theo số lượng xử lý.')
h('Bước 7 Đẩy kết quả hoàn thành lên BRAVO')
p('Khi Thống kê và Hoàn thành lệnh trên MES thành công, phiếu được đẩy lên BRAVO. BRAVO tự động sinh phiếu xuất chuyển mã theo kho xuất và kho nhập đã chỉ định trước đó.')
note('Cần đẩy đúng thông tin hoàn thành của lệnh và đúng kho xuất, kho nhập đã chỉ định.')
image_slot(5,'Màn hình Thống kê và Hoàn thành lệnh trên MES',7)

d.add_page_break(); h('1 6 Phiếu xuất chuyển mã tự động trên BRAVO')
h('Thông tin đầu phiếu')
table(['Trường','Chú ý cần đẩy đúng'],[
('K Kho xuất','Cần đẩy đúng kho xuất đã chỉ định.'),
('J Kho nhập','Cần đẩy đúng kho nhập đã chỉ định.'),
('9 Giao dịch','Cần đẩy đúng 2212 — Xuất chuyển mã cho Rework tự động.')],[4,13])
h('Thông tin chi tiết')
note('Nhóm Vật tư xuất: cần đẩy đúng mã vật tư chính đã đăng ký trên lệnh công đoạn, TK nợ và TK có.')
note('Nhóm Vật tư nhập: cần đẩy đúng danh sách mã NVL chính cấu thành nên hàng đã khai báo ở Rework.')
p('Kết thúc luồng: MES hoàn thành lệnh thành công, dữ liệu được đẩy lên BRAVO và BRAVO tự động sinh phiếu xuất chuyển mã với thông tin đúng theo lệnh và khai báo Rework.')
image_slot(6,'Phiếu xuất chuyển mã gồm đầu phiếu và nhóm vật tư xuất nhập',6)

page('2 Sorting')
p('Nhóm Sorting gồm hai loại nghiệp vụ:')
p('7A Sorting nội bộ.')
p('7B Sorting hàng bán bị trả lại theo RMA.')
h('2 1 Quy trình hoạt động')
p('[BỔ SUNG NỘI DUNG QUY TRÌNH SORTING TẠI ĐÂY]')
d.core_properties.title='Quy trình xử lý Rework và Sorting trên MES và BRAVO'
d.core_properties.subject='Rework 8A 8B và Sorting 7A 7B'
d.core_properties.author=''
target=base/'Quy_trinh_Rework_Sorting_MES_BRAVO.docx'
d.save(target)
print(target)
