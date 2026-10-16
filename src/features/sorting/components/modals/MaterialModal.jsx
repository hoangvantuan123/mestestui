import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Plus,
  Minus,
  Trash2,
  Package,
  Layers,
  FileText,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Search
} from 'lucide-react';

import { PRODUCT_BOM_MAP, getOrderBOM } from '../../data/bomData';
import {
  OBJECT_ENTITY_OPTIONS,
  DEPARTMENT_OPTIONS,
  WORKSHOP_WAREHOUSE_OPTIONS,
  EXPORT_WAREHOUSE_OPTIONS
} from '../../data/masterOptions';

export { PRODUCT_BOM_MAP };

const WAREHOUSE_OPTIONS = EXPORT_WAREHOUSE_OPTIONS;

export default function MaterialModal({ isOpen, onClose, order, orders = [], onConfirm }) {
  // Consolidate selected orders: use orders array if present, else fallback to [order]
  const targetOrders = (orders && orders.length > 0) ? orders : (order ? [order] : []);

  const [materialRows, setMaterialRows] = useState([]);
  const [objectEntity, setObjectEntity] = useState('GS5: Nhà máy Goldsun Quế Võ 5'); // 9. Đối tượng (cho edit)
  const creatorUser = 'it06: Hoàng Văn Tuấn (Trạm Sorting/Rework G01)'; // a. Người tạo (Khóa theo tài khoản MES)
  const [department, setDepartment] = useState('PX-RW01: Phân xưởng Rework / Sorting G01'); // c. Bộ phận (cho edit)
  const [importWarehouse, setImportWarehouse] = useState('GS5-PXU-05: Kho TD PX 1B - QV1'); // d. Kho nhập PX (cho edit)
  const [noteDescription, setNoteDescription] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  // Nạp danh sách NVL chính tương ứng của từng lệnh công đoạn được chọn
  useEffect(() => {
    if (isOpen && targetOrders.length > 0) {
      const orderCodes = targetOrders.map((o) => o.stepOrder).join(', ');
      setNoteDescription(`[MES Shopfloor] Đề xuất xuất kho NVL chính theo lệnh: ${orderCodes} - Trạm Sorting/Rework G01`);

      const rows = targetOrders.map((ord, idx) => {
        const qtyNum = parseFloat(String(ord.reworkQty || '20').replace(/,/g, '')) || 20;
        return {
          id: ord.id || idx + 1,
          orderCode: ord.stepOrder,
          parentProduct: ord.productName || ord.productCode,
          itemCode: ord.productCode,
          itemName: ord.productName,
          unit: 'Pcs',
          orderQty: qtyNum,
          pastRequestedQty: 0.0,
          exportedQty: qtyNum,
          requestQty: qtyNum,
          requestDvtQty: qtyNum,
          stockQty: 1246.0,
          exportWarehouse: 'GS5-TPH-01',
          stepOrderFull: `${ord.stepOrder} | ${ord.date || '15/10/2026'} | ${ord.productCode}`,
        };
      });

      setMaterialRows(rows);
    }
  }, [isOpen, targetOrders.length]);

  if (!isOpen || targetOrders.length === 0) return null;

  // Handle quantity changes
  const handleUpdateQty = (id, newQty) => {
    const validQty = Math.max(0, parseFloat(newQty) || 0);
    setMaterialRows((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            requestQty: validQty,
            requestDvtQty: validQty,
          };
        }
        return r;
      })
    );
  };

  // Stepper increment / decrement
  const handleStepQty = (id, delta) => {
    setMaterialRows((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextVal = Math.max(0, (r.requestQty || 0) + delta);
          return {
            ...r,
            requestQty: nextVal,
            requestDvtQty: nextVal,
          };
        }
        return r;
      })
    );
  };

  // Update specific field on row (e.g., exportWarehouse)
  const handleUpdateRowField = (id, field, value) => {
    setMaterialRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  // Remove material row
  const handleRemoveRow = (id) => {
    if (materialRows.length > 1) {
      setMaterialRows((prev) => prev.filter((r) => r.id !== id));
    }
  };

  // Bulk action: Fill 100% order quantity for all rows
  const handleSetAllToOrderQty = () => {
    setMaterialRows((prev) =>
      prev.map((r) => ({
        ...r,
        requestQty: r.orderQty,
        requestDvtQty: r.orderQty,
      }))
    );
  };

  // Bulk action: Reset all request quantities to 0
  const handleResetAllToZero = () => {
    setMaterialRows((prev) =>
      prev.map((r) => ({
        ...r,
        requestQty: 0,
        requestDvtQty: 0,
      }))
    );
  };

  // Summary statistics
  const totalItems = materialRows.length;
  const totalRequestedQty = materialRows.reduce((sum, r) => sum + (parseFloat(r.requestQty) || 0), 0);
  const totalOrderQty = materialRows.reduce((sum, r) => sum + (parseFloat(r.orderQty) || 0), 0);
  const hasInsufficientStock = materialRows.some((r) => (r.requestQty || 0) > r.stockQty);

  // Filtered rows for fast searching
  const filteredRows = materialRows.filter((r) => {
    if (!searchFilter.trim()) return true;
    const query = searchFilter.toLowerCase();
    return (
      r.itemCode.toLowerCase().includes(query) ||
      r.itemName.toLowerCase().includes(query) ||
      r.orderCode.toLowerCase().includes(query)
    );
  });

  return (
    <div className="mes-modal-backdrop" onClick={onClose}>
      <div
        className="mes-modal-box mes-material-redesigned-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Flat Enterprise Header - Sharp Corners, No Shadow */}
        <div className="mes-material-header">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-700 text-white flex items-center justify-center rounded-[2px]">
              <Package size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[14px] font-bold text-slate-900 tracking-tight">
                  Đề nghị Xuất kho Nguyên vật liệu (NVL)
                </h2>
                <span className="bg-slate-100 text-slate-800 text-[11px] px-2 py-0.5 border border-slate-300 font-mono font-bold rounded-[2px]">
                  Mã phiếu: IR2610-000047
                </span>
                <span className="bg-blue-50 text-blue-800 text-[11px] px-2 py-0.5 border border-blue-200 font-semibold rounded-[2px]">
                  Phân loại: X01: Xuất theo lệnh
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                <span>Trạm Sorting/Rework G01</span>
                <span>•</span>
                <span>Ngày: 15/10/2026</span>
                <span>•</span>
                <span className="text-slate-700 font-medium">
                  {targetOrders.length === 1 ? (
                    <>Lệnh sản xuất: <strong className="font-mono text-blue-800">{targetOrders[0].stepOrder}</strong></>
                  ) : (
                    <>Đang chọn: <strong className="font-mono text-blue-800">{targetOrders.length} lệnh sản xuất</strong></>
                  )}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            className="w-8 h-8 border border-slate-300 text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer rounded-[2px]"
            onClick={onClose}
            title="Đóng cửa sổ"
          >
            <X size={18} />
          </button>
        </div>

        {/* Master Form Section - 2 Columns Layout for Easy Cross-Referencing */}
        <div className="bg-slate-50 border-b border-slate-300 px-6 py-3 text-xs flex-shrink-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-2">
            {/* CỘT TRÁI: Lệnh, Đối tượng & Phân loại */}
            <div className="space-y-2">
              {/* 8. Lệnh công đoạn */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 whitespace-nowrap text-xs w-32 shrink-0 flex items-center gap-1.5">
                  <FileText size={13} className="text-blue-700" />
                  <span>8. Lệnh công đoạn:</span>
                </span>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={targetOrders.map((o) => o.stepOrder).join(', ')}
                  className="w-full text-xs font-mono font-bold border border-slate-300 rounded-[2px] px-2.5 py-1.5 bg-slate-100 text-blue-900 cursor-not-allowed select-none"
                  title="Danh sách các lệnh công đoạn được chọn"
                />
              </div>

              {/* 9. Đối tượng (Cho phép chọn/edit) */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 whitespace-nowrap text-xs w-32 shrink-0 flex items-center gap-1.5">
                  <Package size={13} className="text-blue-700" />
                  <span>9. Đối tượng:</span>
                </span>
                <select
                  className="w-full text-xs font-semibold border border-slate-300 rounded-[2px] px-2.5 py-1.5 bg-white text-slate-900 focus:border-blue-600 outline-none cursor-pointer"
                  value={objectEntity}
                  onChange={(e) => setObjectEntity(e.target.value)}
                >
                  {OBJECT_ENTITY_OPTIONS.map((opt) => (
                    <option key={opt.code} value={opt.name}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Phân loại xuất kho */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 whitespace-nowrap text-xs w-32 shrink-0 flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-700" />
                  <span>Phân loại xuất:</span>
                </span>
                <input
                  type="text"
                  readOnly
                  disabled
                  value="X01: Xuất theo lệnh sản xuất / Rework"
                  className="w-full text-xs font-semibold border border-slate-300 rounded-[2px] px-2.5 py-1.5 bg-slate-100 text-slate-800 cursor-not-allowed select-none"
                />
              </div>
            </div>

            {/* CỘT PHẢI: Người tạo, Bộ phận, Kho nhập PX */}
            <div className="space-y-2">
              {/* a. Người tạo phiếu (Khóa theo tài khoản MES) */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 whitespace-nowrap text-xs w-32 shrink-0 flex items-center gap-1.5">
                  <AlertCircle size={12} className="text-slate-500" />
                  <span>a. Người tạo phiếu:</span>
                </span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={creatorUser}
                    className="w-full text-xs font-semibold border border-slate-300 rounded-[2px] px-2.5 py-1.5 bg-slate-200/80 text-slate-800 cursor-not-allowed select-none truncate"
                    title="Người tạo phiếu khóa cố định theo tài khoản đăng nhập MES"
                  />
                  <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9.5px] font-bold text-slate-500 bg-slate-300/80 px-1 py-0.2 rounded-[2px]">
                    MES User
                  </span>
                </div>
              </div>

              {/* c. Bộ phận (Cho phép chọn/edit) */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 whitespace-nowrap text-xs w-32 shrink-0 flex items-center gap-1.5">
                  <Layers size={13} className="text-indigo-700" />
                  <span>c. Bộ phận:</span>
                </span>
                <select
                  className="w-full text-xs font-semibold border border-slate-300 rounded-[2px] px-2.5 py-1.5 bg-white text-slate-900 focus:border-blue-600 outline-none cursor-pointer"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  {DEPARTMENT_OPTIONS.map((dept) => (
                    <option key={dept.code} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* d. Mã kho phân xưởng (Kho nhập đích - Cho phép chọn/edit) */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 whitespace-nowrap text-xs w-32 shrink-0 flex items-center gap-1.5">
                  <Layers size={13} className="text-emerald-700" />
                  <span>d. Kho nhập PX:</span>
                </span>
                <select
                  className="w-full text-xs font-semibold border border-slate-300 rounded-[2px] px-2.5 py-1.5 bg-white text-slate-900 focus:border-blue-600 outline-none cursor-pointer"
                  value={importWarehouse}
                  onChange={(e) => setImportWarehouse(e.target.value)}
                >
                  {WORKSHOP_WAREHOUSE_OPTIONS.map((wh) => (
                    <option key={wh.code} value={wh.name}>
                      {wh.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hàng full-width: Diễn giải / Ghi chú */}
            <div className="lg:col-span-2 flex items-center gap-2 pt-1.5 border-t border-slate-200">
              <span className="font-bold text-slate-700 whitespace-nowrap text-xs w-32 shrink-0 flex items-center gap-1.5">
                <FileText size={13} className="text-amber-700" />
                <span>Diễn giải / Ghi chú:</span>
              </span>
              <input
                type="text"
                className="w-full text-xs border border-slate-300 rounded-[2px] px-2.5 py-1.5 bg-white text-slate-900 focus:border-blue-600 outline-none font-mono"
                value={noteDescription}
                onChange={(e) => setNoteDescription(e.target.value)}
                placeholder="Thông tin diễn giải xuất kho NVL theo lệnh..."
              />
            </div>
          </div>
        </div>

        {/* Action & Filter Strip */}
        <div className="bg-white border-b border-slate-300 px-5 py-2 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
      

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                className="pl-7 pr-3 py-1.5 text-xs border border-slate-300 rounded-[2px] bg-white focus:border-blue-600 outline-none w-56 sm:w-64"
                placeholder="Tìm mã hoặc tên NVL..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
              {searchFilter && (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs"
                  onClick={() => setSearchFilter('')}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="text-xs bg-slate-100 border border-slate-300 px-3 py-1.5 font-medium text-slate-700 rounded-[2px] whitespace-nowrap">
              <span>Số lượng NVL: <strong className="text-slate-900 font-bold">{filteredRows.length}</strong></span>
              <span className="text-slate-300 mx-2">|</span>
              <span>Tổng SL xuất: <strong className="text-blue-900 font-mono font-bold">{totalRequestedQty.toLocaleString()} Pcs</strong></span>
            </div>
          </div>
        </div>

        {/* Full-Width Open Enterprise Table */}
        <div className="mes-material-body p-0 overflow-auto flex-1">
          {filteredRows.length === 0 ? (
            <div className="py-14 text-center text-slate-400">
              <Package size={40} className="mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold">Không tìm thấy vật tư nào phù hợp</p>
              <button
                type="button"
                className="mt-2 text-xs text-blue-700 font-bold hover:underline cursor-pointer"
                onClick={() => setSearchFilter('')}
              >
                Xóa bộ lọc tìm kiếm
              </button>
            </div>
          ) : (
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold text-[11px] uppercase tracking-tight sticky top-0 z-10">
                  <th className="py-2.5 px-3 text-center w-12 border-r border-slate-200">#</th>
                  <th className="py-2.5 px-3 w-44 border-r border-slate-200">Mã NVL</th>
                  <th className="py-2.5 px-3 min-w-[280px] border-r border-slate-200">Tên nguyên vật liệu, linh kiện</th>
                  <th className="py-2.5 px-2.5 text-center w-16 border-r border-slate-200">ĐVT</th>
                  <th className="py-2.5 px-3 w-44 border-r border-slate-200">Lệnh công đoạn</th>
                  <th className="py-2.5 px-3 text-right w-36 border-r border-slate-200 bg-slate-50">SL theo lệnh</th>
                  <th className="py-2.5 px-3 text-right w-44 border-r border-slate-200 bg-slate-50">Tồn kho khả dụng</th>
                  <th className="py-2.5 px-3 text-center w-72 border-r border-slate-200 bg-blue-50/40">SL đề xuất xuất (Sửa)</th>
                  <th className="py-2.5 px-3 min-w-[240px] border-r border-slate-200">Kho xuất (Nguồn cấp)</th>
                  <th className="py-2.5 px-2 text-center w-14">Xóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredRows.map((row, idx) => {
                  const isOverStock = (row.requestQty || 0) > row.stockQty;
                  const isFullOrder = Number(row.requestQty) === Number(row.orderQty);
                  const isZero = Number(row.requestQty) === 0;

                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        isOverStock ? 'bg-red-50/20' : ''
                      }`}
                    >
                      {/* # STT */}
                      <td className="py-2.5 px-3 text-center font-bold text-slate-600 border-r border-slate-200 bg-slate-50/60">
                        {idx + 1}
                      </td>

                      {/* Mã NVL */}
                      <td className="py-2.5 px-3 border-r border-slate-200 font-mono font-bold text-blue-900 text-xs">
                        {row.itemCode}
                      </td>

                      {/* Tên NVL */}
                      <td className="py-2.5 px-3 border-r border-slate-200 text-slate-900 font-semibold text-[11.5px]">
                        {row.itemName}
                      </td>

                      {/* Đơn vị tính */}
                      <td className="py-2.5 px-2.5 text-center border-r border-slate-200 text-slate-600 font-medium">
                        {row.unit}
                      </td>

                      {/* Lệnh công đoạn */}
                      <td className="py-2.5 px-3 border-r border-slate-200 font-mono text-slate-700 text-xs">
                        {row.orderCode}
                      </td>

                      {/* CỘT RIÊNG: SL Theo Lệnh */}
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 text-[13px] border-r border-slate-200 bg-slate-50/50">
                        {Number(row.orderQty).toLocaleString()}
                      </td>

                      {/* CỘT RIÊNG: Tồn Kho Khả Dụng */}
                      <td className="py-2.5 px-3 text-right border-r border-slate-200 bg-slate-50/50">
                        <div className="font-mono font-bold text-slate-800 text-[13px]">
                          {Number(row.stockQty).toLocaleString()}
                        </div>
                        <div className="mt-0.5">
                          {isOverStock ? (
                            <span className="text-[10px] bg-red-100 text-red-700 border border-red-200 px-1.5 py-0.2 font-bold rounded-[2px] inline-flex items-center gap-0.5">
                              <AlertCircle size={10} /> Thiếu tồn
                            </span>
                          ) : (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 font-bold rounded-[2px] inline-flex items-center gap-0.5">
                              <CheckCircle2 size={10} /> Đủ tồn
                            </span>
                          )}
                        </div>
                      </td>

                      {/* CỘT RIÊNG: SL Đề Xuất Xuất (Stepper + Phím tắt) */}
                      <td className="py-2 px-3 border-r border-slate-200 bg-blue-50/20">
                        <div className="flex flex-col items-center gap-1">
                          {/* Stepper */}
                          <div className="flex items-center w-full max-w-[190px]">
                            <button
                              type="button"
                              className="w-8 h-8 border border-slate-300 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none rounded-l-[2px]"
                              onClick={() => handleStepQty(row.id, -1)}
                              disabled={row.requestQty <= 0}
                              title="Giảm 1"
                            >
                              <Minus size={15} />
                            </button>

                            <input
                              type="number"
                              step="any"
                              min="0"
                              className="flex-1 h-8 border-y border-slate-300 bg-white px-2 text-center text-sm font-bold font-mono text-blue-900 focus:border-blue-600 outline-none"
                              value={row.requestQty}
                              onChange={(e) => handleUpdateQty(row.id, e.target.value)}
                              onFocus={(e) => e.target.select()}
                            />

                            <button
                              type="button"
                              className="w-8 h-8 border border-slate-300 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-blue-800 font-bold flex items-center justify-center transition-colors cursor-pointer rounded-r-[2px]"
                              onClick={() => handleStepQty(row.id, 1)}
                              title="Tăng 1"
                            >
                              <Plus size={15} />
                            </button>
                          </div>

                          {/* Phím tắt nhanh 1 chạm */}
                       
                        </div>
                      </td>

                      {/* CỘT RIÊNG: Kho Xuất Nguồn Cấp (Hiển thị đầy đủ tên kho) */}
                      <td className="py-2.5 px-3 border-r border-slate-200">
                        <select
                          className="w-full text-xs font-medium border border-slate-300 rounded-[2px] px-2 py-1.5 bg-white text-slate-800 focus:border-blue-600 outline-none cursor-pointer"
                          value={row.exportWarehouse}
                          onChange={(e) => handleUpdateRowField(row.id, 'exportWarehouse', e.target.value)}
                        >
                          {WAREHOUSE_OPTIONS.map((wh) => (
                            <option key={wh.code} value={wh.code}>
                              {wh.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* CỘT RIÊNG: Xóa */}
                      <td className="py-2.5 px-2 text-center">
                        <button
                          type="button"
                          className="w-7 h-7 rounded-[2px] border border-slate-200 text-slate-400 hover:text-red-700 hover:border-red-300 hover:bg-red-50 inline-flex items-center justify-center transition-colors cursor-pointer"
                          onClick={() => handleRemoveRow(row.id)}
                          title="Xóa dòng vật tư này"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Flat Bottom Action Bar - Full Width, Sharp Corners, No Shadow */}
        <div className="mes-material-bottom-bar">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Mặt hàng NVL:</span>
              <strong className="text-slate-800 font-bold bg-slate-100 border border-slate-300 px-2 py-0.5 rounded-[2px]">
                {totalItems} mặt hàng
              </strong>
            </div>

            <span className="text-slate-300">|</span>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Tổng SL yêu cầu:</span>
              <strong className="text-blue-900 font-bold font-mono text-sm bg-blue-50 border border-blue-300 px-2.5 py-0.5 rounded-[2px]">
                {totalRequestedQty.toLocaleString()} Pcs
              </strong>
            </div>

            <span className="text-slate-300">|</span>

            <div className="hidden md:flex items-center gap-1.5 text-slate-600">
              <Layers size={14} className="text-slate-400" />
              <span>Đích: <strong className="text-slate-800 font-medium">{importWarehouse.split(':')[0]}</strong></span>
            </div>

            {hasInsufficientStock && (
              <div className="flex items-center gap-1 text-red-700 font-bold bg-red-50 border border-red-300 px-2 py-0.5 text-[11px] rounded-[2px]">
                <AlertCircle size={13} />
                <span>Cảnh báo: Có mặt hàng vượt tồn kho</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="px-4 py-2 text-xs font-semibold border border-slate-300 rounded-[2px] bg-white text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer"
              onClick={onClose}
            >
              Hủy bỏ
            </button>

            <button
              type="button"
              className="px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 rounded-[2px] border border-amber-600 transition-colors flex items-center gap-1.5 cursor-pointer"
              onClick={() => {
                onConfirm && onConfirm({ materialRows, objectEntity, importWarehouse, noteDescription });
                onClose();
              }}
            >
              <Check size={16} className="stroke-[2.5]" />
              <span>Đồng ý đề nghị xuất kho</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
