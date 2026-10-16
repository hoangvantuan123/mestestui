from pathlib import Path
from docx import Document
from docx.oxml import OxmlElement
from docx.text.paragraph import Paragraph
from docx.shared import Pt
from copy import deepcopy
import hashlib

root=Path(__file__).parent
d=Document(root/'Quy_trinh_Rework_Sorting_MES_BRAVO_Bo_sung_muc_3.docx')
def hashes(doc):return [hashlib.sha256(r.target_part.blob).hexdigest() for r in doc.part.rels.values() if 'image' in r.reltype]
before=hashes(d)
start=next(p for p in d.paragraphs if p.text=='2 Sorting')
end=next(p for p in d.paragraphs if p.style.name=='Heading 1' and p.text.startswith('3 '))
node=start._p.getnext()
while node is not end._p:
    nxt=node.getnext();node.getparent().remove(node);node=nxt
def p(text,style='Normal',newpage=False):
    el=OxmlElement('w:p');end._p.addprevious(el)
    x=Paragraph(el,end._parent);x.style=style;x.add_run(text)
    if newpage:x.paragraph_format.page_break_before=True
    return x
def h(t,newpage=False):return p(t,'Heading 2',newpage)
def sub(t):return p(t,'Heading 3')
def note(t):
    x=p('');x.add_run('Chú ý: ').bold=True;x.add_run(t)
image_number=4
def slot(t):
    global image_number
    image_number+=1
    x=p(f'Hình {image_number}  {t}','Caption');x.paragraph_format.keep_with_next=True
    x=p(f'[CHÈN ẢNH SORTING {image_number} TẠI ĐÂY]');x.alignment=1
    x.paragraph_format.space_before=Pt(12);x.paragraph_format.space_after=Pt(36)
    x.runs[0].italic=True

def fields(rows):
    # Reuse the Rework table formatting for consistent field notes.
    t=d.add_table(rows=1,cols=2)
    template=d.tables[0]
    old=t._tbl
    new=deepcopy(template._tbl)
    old.getparent().replace(old,new)
    end._p.addprevious(new)
    from docx.table import Table
    t=Table(new,d._body)
    while len(t.rows)>1:new.remove(t.rows[-1]._tr)
    t.rows[0].cells[0].text='Mục'
    t.rows[0].cells[1].text='Chú ý cần đẩy đúng'
    for label,text in rows:
        row=deepcopy(template.rows[1]._tr);new.append(row)
        for c,txt in zip(t.rows[-1].cells,[label,text]):
            c.text=txt
            for para in c.paragraphs:
                para.paragraph_format.space_after=Pt(2)
                para.paragraph_format.line_spacing=1.05
                for r in para.runs:r.font.size=Pt(10)
    p('')

h('2 1 Phạm vi và luồng tổng quát')
p('Nhóm Sorting gồm 7A Sorting nội bộ và 7B Sorting hàng bán bị trả lại theo RMA. Một lệnh Sorting có thể đăng ký nhiều mã hàng cần Sorting ở chi tiết lệnh công đoạn.')
sub('Luồng hoạt động')
for text in [
'1. BRAVO tạo lệnh công đoạn Sorting và chọn đúng phân loại 7A hoặc 7B.',
'2. Đăng ký các mã hàng cần Sorting ở chi tiết lệnh; một lệnh có thể gồm nhiều mã hàng.',
'3. MES đồng bộ lệnh về MES Admin và MES xưởng; người vận hành chọn lệnh để Sorting.',
'4. Thực hiện Lấy NVL trên MES để đẩy phiếu đề nghị xuất kho lên BRAVO.',
'5. Thực hiện Sorting theo từng mã hàng thuộc chi tiết lệnh công đoạn.',
'6. Đăng ký thông tin đầu phiếu và các mã hàng hoàn thành trên MES.',
'7. Hoàn thành trên MES và đẩy đầy đủ phiếu về BRAVO.']:p(text)
note('Sorting nội bộ được xử lý theo từng mã hàng ở chi tiết lệnh công đoạn. Không sinh phiếu chuyển mã tự động; luồng nhập kho thành phẩm đi theo các mã hàng chi tiết của lệnh Sorting.')

h('2 2 Tạo lệnh và đồng bộ sang MES',True)
sub('Bước 1 Tạo lệnh công đoạn trên BRAVO')
p('Tạo lệnh công đoạn để thực hiện Sorting. Chọn đúng phân loại 7A hoặc 7B theo nghiệp vụ của lệnh. Đăng ký các mã hàng cần Sorting tại chi tiết lệnh công đoạn; một lệnh có thể có nhiều mã hàng.')
p('Phần đầu lệnh xác định nghiệp vụ Sorting cần thực hiện; phần chi tiết xác định danh sách mã hàng thuộc lệnh. Các mã hàng này được sử dụng xuyên suốt khi Lấy NVL, lập đề nghị xuất kho và đăng ký hoàn thành.')
note('Cần đẩy đúng phân loại và đầy đủ danh sách mã hàng đã đăng ký ở chi tiết lệnh công đoạn.')
sub('Bước 2 Đồng bộ và chọn lệnh trên MES')
p('Lệnh được đồng bộ lên MES Admin và MES xưởng. Trên MES, chọn đúng lệnh để thực hiện Sorting các mã hàng thuộc lệnh đó.')
p('Sau khi lệnh đã xuất hiện trên MES, người vận hành chọn lệnh cần xử lý và thực hiện các thao tác Sorting. Phân loại 7A hoặc 7B và danh sách mã hàng phải theo đúng lệnh công đoạn được đồng bộ từ BRAVO.')
note('Cần đồng bộ đúng lệnh, phân loại và danh sách mã hàng chi tiết về cả MES Admin và MES xưởng.')
slot('Lệnh công đoạn Sorting trên BRAVO và danh sách mã hàng chi tiết')

h('2 3 Lấy NVL và đẩy đề nghị xuất kho',True)
sub('Bước 3 Lấy NVL trên MES')
p('Thực hiện Lấy NVL trên MES để tạo phiếu đề nghị xuất kho trên BRAVO. Khi đăng ký thành công trên MES, phiếu đề nghị xuất kho được tạo trên BRAVO.')
sub('Đầu phiếu đề nghị xuất kho')
fields([('4 Đối tượng','Cần đẩy đúng đối tượng theo lệnh Sorting.'),('6 Công đoạn','Cần đẩy đúng công đoạn của lệnh Sorting.'),('9 Kho nhập','Cần đẩy đúng kho nhập phục vụ Sorting.')])
sub('Chi tiết đề nghị xuất kho')
p('Các mã hàng trên chi tiết đề nghị xuất kho được lấy từ danh sách mã hàng đã đăng ký ở chi tiết lệnh công đoạn để thực hiện Sorting.')
p('Đề nghị xuất kho phải thể hiện đúng các mã hàng chi tiết cần xử lý của lệnh đang chọn. Khi một lệnh có nhiều mã hàng, danh sách vật tư trên đề nghị xuất được lấy theo các mã hàng đó để phục vụ Sorting.')
note('Cần đẩy đúng và đầy đủ các mã hàng chi tiết theo lệnh Sorting.')
slot('Phiếu đề nghị xuất kho Sorting trên BRAVO gồm đầu phiếu và chi tiết')

h('2 4 Thực hiện Sorting theo mã hàng chi tiết',True)
sub('Bước 4 Thực hiện Sorting tại phân xưởng')
p('Thực hiện Sorting theo từng mã hàng đã đăng ký ở chi tiết lệnh công đoạn. Các mã hàng cần được quản lý đúng theo lệnh đang được chọn trên MES.')
p('Sau khi Lấy NVL được đăng ký thành công trên MES và phiếu đề nghị xuất kho đã có trên BRAVO, tiếp tục thực hiện Sorting cho các mã hàng thuộc lệnh. Kết quả hoàn thành được ghi nhận theo từng mã hàng chi tiết.')
note('Cần thực hiện đúng mã hàng và đúng lệnh công đoạn. Một lệnh có nhiều mã hàng nhưng khi đăng ký hoàn thành, từng mã vẫn phải được ghi nhận ở dòng chi tiết tương ứng.')
slot('Màn hình MES thực hiện Sorting theo các mã hàng thuộc lệnh')

h('2 5 Đăng ký và hoàn thành trên MES',True)
sub('Bước 5 Đăng ký thông tin đầu phiếu hoàn thành')
p('Sau khi đăng ký Lấy NVL thành công và phiếu đề nghị xuất đã được tạo trên BRAVO, thực hiện đăng ký hoàn thành trên MES. Điền đầy đủ các thông tin quan trọng có dấu * trên màn hình.')
fields([('Nhà máy','Cần đăng ký và đẩy đúng nhà máy của lệnh.'),('7 Phân loại','Cần chọn và đẩy đúng loại Sorting 7A hoặc 7B theo lệnh.'),('8 Lệnh công đoạn','Cần đăng ký và đẩy đúng lệnh công đoạn đang thực hiện Sorting.'),('d Mã kho phân xưởng','Cần kiểm soát và đẩy đúng mã kho phân xưởng thực hiện Sorting khi đăng ký hoàn thành.')])
sub('Bước 6 Đăng ký chi tiết và hoàn thành')
p('Tại chi tiết phiếu hoàn thành, có thể hoàn thành nhiều mã hàng cùng lúc. Tất cả mã hàng chi tiết phải thuộc cùng lệnh công đoạn đã đăng ký ở đầu phiếu master.')
note('Cần đẩy đúng từng mã hàng chi tiết và bảo đảm các mã cùng thuộc lệnh công đoạn trên master trước khi hoàn thành.')
p('Ví dụ: lệnh Sorting A có ba mã hàng ở chi tiết thì có thể đăng ký hoàn thành cả ba mã trong cùng một phiếu, với điều kiện đầu phiếu đang chọn đúng lệnh A. Không gộp mã hàng thuộc lệnh B vào phiếu hoàn thành của lệnh A.')
slot('Màn hình hoàn thành Sorting gồm các trường có dấu sao và nhiều mã hàng chi tiết')

h('2 6 Đẩy phiếu về BRAVO và kết thúc luồng',True)
sub('Bước 7 Đồng bộ phiếu hoàn thành về BRAVO')
p('Sau khi hoàn thành trên MES, hệ thống đẩy đầy đủ phiếu hoàn thành về BRAVO, gồm thông tin đầu phiếu và các mã hàng ở chi tiết. Kết thúc luồng khi phiếu đã được đẩy đầy đủ về BRAVO.')
note('Cần đẩy đầy đủ nhà máy, phân loại 7A hoặc 7B, lệnh công đoạn, mã kho phân xưởng và toàn bộ chi tiết mã hàng hoàn thành.')
sub('Nhập kho thành phẩm và chuyển mã')
p('Đối với Sorting nội bộ, phiếu nhập kho thành phẩm đi theo từng mã hàng chi tiết thuộc lệnh Sorting. Không sinh phiếu chuyển mã tự động.')
p('Khi đối chiếu phiếu nhập kho thành phẩm của Sorting nội bộ, chú ý các mã hàng chi tiết và lệnh công đoạn liên quan. Kết quả xử lý cần phản ánh đúng các mã hàng đã đăng ký hoàn thành trên MES.')
note('Cần đẩy đúng các mã hàng chi tiết của lệnh Sorting nội bộ vào luồng nhập kho thành phẩm.')
p('Kết thúc luồng: MES hoàn thành thành công và phiếu được chuyển đầy đủ về BRAVO, đúng thông tin đầu phiếu và danh sách mã hàng chi tiết cùng lệnh công đoạn.')
slot('Phiếu hoàn thành và phiếu nhập kho thành phẩm Sorting nội bộ trên BRAVO')

target=root/'Quy_trinh_Rework_Sorting_MES_BRAVO_Sorting_chi_tiet.docx'
d.save(target)
v=Document(target)
assert before==hashes(v)
assert len(v.inline_shapes)==4
assert len([x for x in v.paragraphs if x.style.name=='Heading 1'])==3
assert any('3 2 Sorting'==x.text for x in v.paragraphs)
print(target)
print('Verified 4 original images, 3 main sections and MES sample section preserved')
