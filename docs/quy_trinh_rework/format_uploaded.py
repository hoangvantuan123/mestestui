from pathlib import Path
from docx import Document
from docx.shared import Cm, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
import re, hashlib

root=Path(__file__).parent
source=Path('C:/Users/tuanhoang/Downloads/Quy_trinh_Rework_Sorting_MES_BRAVO.docx')
d=Document(source)
original_blobs=[hashlib.sha256(r.target_part.blob).hexdigest() for r in d.part.rels.values() if 'image' in r.reltype]
for s in d.sections:
    s.page_width=Cm(21); s.page_height=Cm(29.7)
    s.top_margin=s.bottom_margin=Cm(1.7)
    s.left_margin=s.right_margin=Cm(1.8)
for name,size in [('Normal',11),('Title',23),('Heading 1',18),('Heading 2',14),('Heading 3',11.5),('Caption',10)]:
    st=d.styles[name];st.font.name='Arial';st.font.size=Pt(size);st.font.color.rgb=RGBColor(0,0,0)
    pf=st.paragraph_format;pf.space_before=Pt(0 if name=='Normal' else 10);pf.space_after=Pt(6)
    pf.line_spacing=1.1
    if name.startswith('Heading'):pf.keep_with_next=True

caption_map={
'Hình 1':'Hình 1  Lệnh công đoạn Rework trên BRAVO',
'Hình 3':'Hình 2  Phiếu đề nghị xuất kho trên BRAVO',
'Hình 4':'Vị trí bổ sung ảnh chứng từ điều chuyển kho trên BRAVO',
'Hình 5':'Hình 3  Phiếu thống kê sản xuất Rework trên BRAVO sau khi hoàn thành MES',
'Hình 6':'Hình 4  Phiếu xuất chuyển mã trên BRAVO'}
for p in list(d.paragraphs):
    text=p.text.strip(); has_image=bool(p._p.xpath('.//w:drawing|.//w:pict'))
    if not text and not has_image:
        p._element.getparent().remove(p._element);continue
    if text=='[CHÈN ẢNH 1 TẠI ĐÂY]':
        p._element.getparent().remove(p._element);continue
    pf=p.paragraph_format
    pf.space_before=Pt(0);pf.space_after=Pt(6);pf.line_spacing=1.1
    pf.keep_with_next=False;pf.keep_together=False;pf.widow_control=True
    # Remove old explicit page breaks; control pagination through heading styles.
    for br in p._p.xpath('.//w:br[@w:type="page"]'):br.getparent().remove(br)
    for r in p.runs:
        r.font.name='Arial';r.font.color.rgb=RGBColor(0,0,0)
        if not has_image:r.font.size=None
    if p.style.name=='Heading 1':
        pf.page_break_before=(text.startswith('2 '));pf.keep_with_next=True
        pf.space_before=Pt(14)
    elif p.style.name=='Heading 2':
        # One procedure section per page keeps instructions and its screenshot together.
        pf.page_break_before=not text.startswith(('1 1','2 1'))
        pf.keep_with_next=True;pf.space_after=Pt(9)
    elif p.style.name=='Heading 3':
        pf.keep_with_next=True;pf.space_before=Pt(8)
    if p.style.name=='Title':pf.space_after=Pt(10);pf.keep_with_next=True
    for prefix,new in caption_map.items():
        if text.startswith(prefix+' '):
            p.text=new;p.style='Caption';pf.keep_with_next=True
            pf.space_before=Pt(8);pf.space_after=Pt(5)
            p.alignment=WD_ALIGN_PARAGRAPH.CENTER
            break
    if text.startswith('[CHÈN ẢNH 4'):
        p.text='[Bổ sung ảnh chứng từ điều chuyển kho tại đây]'
        p.alignment=WD_ALIGN_PARAGRAPH.CENTER;pf.space_before=Pt(12);pf.space_after=Pt(24)
        p.runs[0].italic=True;p.runs[0].font.size=Pt(10)
    if has_image:
        p.alignment=WD_ALIGN_PARAGRAPH.CENTER
        pf.space_before=Pt(0);pf.space_after=Pt(8);pf.line_spacing=1
        pf.keep_together=True
    if text.startswith('Chú ý:'):
        for r in p.runs:r.bold=False
        if p.runs and p.runs[0].text.startswith('Chú ý:'):p.runs[0].bold=True

for i,s in enumerate(d.inline_shapes,1):
    ratio=s.height/s.width
    s.width=Cm(17.4);s.height=int(s.width*ratio)
    prop=s._inline.docPr
    prop.set('descr',caption_map[list(caption_map)[[0,1,3,4][i-1]]])

for t in d.tables:
    t.alignment=WD_TABLE_ALIGNMENT.CENTER;t.autofit=False
    widths=[4,13.4]
    for c,w in zip(t.columns,widths):c.width=Cm(w)
    for i,row in enumerate(t.rows):
        row.height=None
        for j,c in enumerate(row.cells):
            c.width=Cm(widths[j]);c.vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER
            pr=c._tc.get_or_add_tcPr()
            for old in list(pr):
                if old.tag in [qn('w:tcBorders'),qn('w:tcMar'),qn('w:shd')]:pr.remove(old)
            borders=OxmlElement('w:tcBorders')
            for edge in ['top','bottom','left','right']:
                e=OxmlElement('w:'+edge)
                for k,v in [('val','single'),('sz','4'),('color','D9D9D9')]:e.set(qn('w:'+k),v)
                borders.append(e)
            pr.append(borders)
            sh=OxmlElement('w:shd');sh.set(qn('w:fill'),'DCE6F1' if i==0 else ('F5F7FA' if i%2==0 else 'FFFFFF'));pr.append(sh)
            mar=OxmlElement('w:tcMar')
            for edge in ['top','bottom','left','right']:
                e=OxmlElement('w:'+edge);e.set(qn('w:w'),'100');e.set(qn('w:type'),'dxa');mar.append(e)
            pr.append(mar)
            for p in c.paragraphs:
                p.paragraph_format.space_after=Pt(2);p.paragraph_format.line_spacing=1.05
                for r in p.runs:r.font.name='Arial';r.font.size=Pt(10);r.bold=(i==0)
        trpr=row._tr.get_or_add_trPr();e=OxmlElement('w:cantSplit');trpr.append(e)

# Prepare the same heading hierarchy for the later Sorting content without adding business rules.
sorting_start=next(i for i,p in enumerate(d.paragraphs) if p.text=='2 Sorting')
for p in list(d.paragraphs)[sorting_start+1:]:p._element.getparent().remove(p._element)
d.add_heading('2 1 Phạm vi và luồng tổng quát',2)
d.add_paragraph('Nhóm Sorting gồm 7A Sorting nội bộ và 7B Sorting hàng bán bị trả lại theo RMA.')
d.add_paragraph('[Bổ sung luồng hoạt động tổng quát của Sorting]')
for title in ['2 2 Tạo lệnh và đồng bộ sang MES','2 3 Thao tác vật tư trên MES và BRAVO','2 4 Xử lý Sorting tại phân xưởng','2 5 Thống kê và hoàn thành lệnh','2 6 Chứng từ phát sinh trên BRAVO']:
    p=d.add_heading(title,2);p.paragraph_format.page_break_before=False
    d.add_paragraph('[Bổ sung các bước thực hiện, chú ý cần đẩy đúng và ảnh minh họa]')

# Page numbers support navigation while extending the document.
for s in d.sections:
    p=s.footer.paragraphs[0];p.alignment=WD_ALIGN_PARAGRAPH.RIGHT
    p.add_run('Trang ').font.size=Pt(9)
    f=OxmlElement('w:fldSimple');f.set(qn('w:instr'),'PAGE');p._p.append(f)

target=root/'Quy_trinh_Rework_Sorting_MES_BRAVO_Can_chinh.docx'
d.save(target)
v=Document(target)
assert len(v.inline_shapes)==4
assert original_blobs==[hashlib.sha256(r.target_part.blob).hexdigest() for r in v.part.rels.values() if 'image' in r.reltype]
assert [p.text for p in v.paragraphs if p.style.name=='Heading 1']==['1 Rework','2 Sorting']
print(target)
print('Verified 4 original images preserved and 2 main headings')
