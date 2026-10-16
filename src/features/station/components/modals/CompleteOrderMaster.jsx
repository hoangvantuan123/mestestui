import MasterLookup from '../../../../shared/ui/MasterLookup';
import React, { useState } from 'react';
import { FACTORY_OPTIONS, OBJECT_ENTITY_OPTIONS, DEPARTMENT_OPTIONS, WORKSHOP_WAREHOUSE_OPTIONS } from '../../data/masterOptions';
import './complete-order-master.css';

export default function CompleteOrderMaster({ order, sortingOrders, isSortingOrder = false, quantity, setQuantity, classification, creatorUser, objectEntity, setObjectEntity, department, setDepartment, workshopWarehouse, setWorkshopWarehouse, workersCount, setWorkersCount, workHours, setWorkHours, noteDescription, setNoteDescription, startTime, endTime, masterProductStock }) {
  const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const [factory, setFactory] = useState('GS5: Nhà máy GS Quế Võ 1');
  const number = n => Number(n).toLocaleString('vi-VN', { maximumFractionDigits: 2 });
  return (
    <section className="completion-master" aria-label="Thông tin phiếu hoàn thành">
      <div className="completion-master-left">
        <div className="completion-master-pair completion-document-row">
          <label className="completion-field"><span>1. Ngày</span><input type="date" readOnly value={date} title="Ngày hiện tại theo giờ Việt Nam, tự động cập nhật khi mở phiếu" /></label>
          <label className="completion-field"><span>2. Số</span><input readOnly value="2610-0061" /></label>
        </div>
        <label className="completion-field"><span><span className="completion-required" title="Bắt buộc" aria-hidden="true">*</span>3. Nhà máy</span><MasterLookup label="Nhà máy" options={FACTORY_OPTIONS} value={factory} onChange={setFactory} /></label>
        <label className="completion-field completion-description"><span>4. Diễn giải</span><textarea value={noteDescription} onChange={e => setNoteDescription(e.target.value)} placeholder="Diễn giải hoàn thành lệnh..." /></label>
        <label className="completion-field"><span><span className="completion-required" title="Bắt buộc" aria-hidden="true">*</span>a. Người tạo phiếu</span><input readOnly value={creatorUser} title="Tài khoản MES đang đăng nhập" /></label>
        <div className="completion-labor-grid">
          <label className="completion-field"><span>g. Số lượng nhân công</span><input type="number" min="1" max="50" value={workersCount} onChange={e => setWorkersCount(Math.min(50, Math.max(1, parseInt(e.target.value, 10) || 1)))} /></label>
          <label className="completion-field"><span>Số lượng theo lệnh</span><input readOnly value="1" /></label>
          <label className="completion-field"><span>h. Số giờ làm (h)</span><input type="number" min="0.1" step="0.25" value={workHours} onChange={e => setWorkHours(Math.max(0.1, parseFloat(e.target.value) || 0.1))} title={`${startTime} → ${endTime}`} /></label>
          <label className="completion-field"><span>Số giờ theo lệnh</span><input readOnly value="1.00" /></label>
        </div>
        <label className="completion-field completion-time-field"><span>Thời gian vận hành</span><input readOnly value={`${startTime.split(' ')[0]} → ${endTime.split(' ')[0]}`} title={`${startTime} → ${endTime}`} /></label>
      </div>
      <div className="completion-master-right">
        <label className="completion-field completion-key-field"><span><span className="completion-required" title="Bắt buộc" aria-hidden="true">*</span>7. Phân loại</span><input readOnly value={classification} title="Phân loại cố định theo lệnh" /></label>
        <label className="completion-field completion-key-field"><span><span className="completion-required" title="Bắt buộc" aria-hidden="true">*</span>8. Lệnh công đoạn</span><input readOnly value={isSortingOrder ? order.stageOrder || order.stepOrder.replace(/\([^)]*\)$/, '') : order.stepOrder} /></label>
        <label className="completion-field"><span><span className="completion-required" title="Bắt buộc" aria-hidden="true">*</span>9. Đối tượng</span><MasterLookup label="Đối tượng" options={OBJECT_ENTITY_OPTIONS} value={objectEntity} onChange={setObjectEntity} /></label>
        <label className="completion-field"><span><span className="completion-required" title="Bắt buộc" aria-hidden="true">*</span>b. Mã hàng</span><input readOnly value={isSortingOrder && sortingOrders?.length > 1 ? `${sortingOrders.length} mặt hàng: ${sortingOrders.map(o => o.productCode).join(', ')}` : `${order.productCode}: ${order.productName}`} title={isSortingOrder && sortingOrders?.length > 1 ? sortingOrders.map(o => `${o.stepOrder}: ${o.productCode} - ${o.productName}`).join('\n') : `${order.productCode}: ${order.productName}`} /></label>
        {!(isSortingOrder && sortingOrders?.length > 1) && <label className="completion-field completion-stock-field"><span>Tồn kho PX (mã b)</span><input readOnly value={`${order.productCode} — ${number(masterProductStock)} Pcs`} title={`Tồn kho phân xưởng của mã hàng tại mục b: ${order.productCode} — ${order.productName}`} /></label>}
        <label className="completion-field"><span><span className="completion-required" title="Bắt buộc" aria-hidden="true">*</span>c. Bộ phận</span><MasterLookup label="Bộ phận" options={DEPARTMENT_OPTIONS} value={department} onChange={setDepartment} /></label>
        <label className="completion-field"><span><span className="completion-required" title="Bắt buộc" aria-hidden="true">*</span>d. Mã kho phân xưởng</span><MasterLookup label="Mã kho phân xưởng" options={WORKSHOP_WAREHOUSE_OPTIONS} value={workshopWarehouse} onChange={setWorkshopWarehouse} /></label>
        {!isSortingOrder && <div className="completion-master-pair completion-quantity-row"><label className="completion-field"><span><span className="completion-required" title="Bắt buộc" aria-hidden="true">*</span>e. Số lượng</span><input type="number" min="0" step="1" value={quantity} onChange={e => setQuantity(Math.max(0, Number(e.target.value) || 0))} /></label><label className="completion-field"><span>f. Đơn vị tính</span><input readOnly value="Pcs" /></label></div>}
      </div>
    </section>
  );
}
