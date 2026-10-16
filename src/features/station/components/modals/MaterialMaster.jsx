import MasterLookup from '../../../../shared/ui/MasterLookup';
import React from 'react';
import { OBJECT_ENTITY_OPTIONS, DEPARTMENT_OPTIONS, WORKSHOP_WAREHOUSE_OPTIONS } from '../../data/masterOptions';
import './complete-order-master.css';
import './material-master.css';

export default function MaterialMaster({ targetOrders, isSortingOrder, creatorUser, objectEntity, setObjectEntity, department, setDepartment, importWarehouse, setImportWarehouse, noteDescription, setNoteDescription }) {
  const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const codes = targetOrders.map(o => o.stepOrder).join(', ');
  return (
    <section className="completion-master material-master" aria-label="Thông tin lấy vật liệu">
      <div className="completion-master-left">
        <div className="completion-master-pair completion-document-row"><label className="completion-field"><span>Ngày yêu cầu</span><input type="date" readOnly value={date} title="Ngày hiện tại theo giờ Việt Nam, không chỉnh sửa" /></label><label className="completion-field"><span>Số phiếu</span><input readOnly value="IR2610-000047" /></label></div>
        <label className="completion-field"><span>Người tạo</span><input readOnly value={creatorUser} title={creatorUser} /></label>
        <label className="completion-field completion-description"><span>Diễn giải</span><textarea aria-label="Diễn giải" value={noteDescription} onChange={e => setNoteDescription(e.target.value)} placeholder="Ghi chú yêu cầu vật liệu..." /></label>
      </div>
      <div className="completion-master-right">
        <label className="completion-field completion-key-field"><span>Lệnh công đoạn</span><input readOnly value={codes} title={codes} /></label>
        <label className="completion-field"><span>Đối tượng</span><MasterLookup label="Đối tượng" options={OBJECT_ENTITY_OPTIONS} value={objectEntity} onChange={setObjectEntity} /></label>
        <label className="completion-field"><span>Bộ phận</span><MasterLookup label="Bộ phận" options={DEPARTMENT_OPTIONS} value={department} onChange={setDepartment} /></label>
        <label className="completion-field material-destination"><span>Kho nhận PX</span><MasterLookup label="Kho nhận PX" options={WORKSHOP_WAREHOUSE_OPTIONS} value={importWarehouse} onChange={setImportWarehouse} /></label>
        <label className="completion-field"><span>Loại yêu cầu</span><input readOnly value={isSortingOrder ? 'Tiếp nhận mặt hàng · Sorting' : 'X01 · Xuất NVL theo lệnh Rework'} /></label>
      </div>
    </section>
  );
}

