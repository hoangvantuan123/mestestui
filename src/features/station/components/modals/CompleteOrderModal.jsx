import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Plus,
  Minus,
  Lock,
  Search,
  Sparkles,
  RotateCcw,
  Clock,
  Users,
  FileText,
  Layers,
  AlertCircle,
  CheckCircle2,
  Building,
  UserCheck,
  Briefcase,
  Warehouse
} from 'lucide-react';
import { getOrderBOM } from '../../data/bomData';
import {
  resolveClassification,
  OBJECT_ENTITY_OPTIONS,
  DEPARTMENT_OPTIONS,
  WORKSHOP_WAREHOUSE_OPTIONS
} from '../../data/masterOptions';

/**
 * Tính số giờ làm việc giữa 2 mốc thời gian dạng HH:mm dd/MM/yyyy hoặc HH:mm
 */
function calculateWorkHours(startStr, endStr) {
  try {
    const parseHourMinute = (str) => {
      if (!str || str === '—') return null;
      const match = str.match(/(\d{1,2}):(\d{2})/);
      if (match) {
        return parseInt(match[1], 10) + parseInt(match[2], 10) / 60;
      }
      return null;
    };

    const startH = parseHourMinute(startStr);
    const endH = parseHourMinute(endStr);

    if (startH !== null && endH !== null) {
      let diff = endH - startH;
      if (diff < 0) diff += 24; // Qua đêm
      return Math.max(0.25, parseFloat(diff.toFixed(2)));
    }
  } catch (e) {
    // Fallback
  }
  return 5.5; // Mặc định 5.5 giờ nếu chưa có đủ timestamp
}

export const MASTER_PRODUCT_STOCK_MAP = {
  'WIS-BSB-00005': 1520,
  'SSA-HC2-00462': 2850,
  'WIS-BSB-00002': 3200,
  'SSA-HMG-00011': 9500,
  'SSA-HMM-00089': 1800,
  'CAN-FSA-00075': 1500,
};

export function getMasterProductStock(productCode, fallbackQty = 0) {
  if (productCode && MASTER_PRODUCT_STOCK_MAP[productCode]) {
    return MASTER_PRODUCT_STOCK_MAP[productCode];
  }
  return Math.max(1200, Math.round((fallbackQty || 100) * 1.5));
}

export default function CompleteOrderModal({
  isOpen,
  onClose,
  order,
  importWarehouse = 'GS5-PXU-05: Kho TD PX 1B - QV1',
  onConfirm
}) {
  const [parts, setParts] = useState([]);

  // Master fields:
  const [objectEntity, setObjectEntity] = useState('GS5: Nhà máy Goldsun Quế Võ 5'); // 9. Đối tượng (cho edit)
  const creatorUser = 'it06: Hoàng Văn Tuấn (Trạm Sorting/Rework G01)'; // a. Người tạo phiếu (Khóa theo tài khoản MES)
  const [department, setDepartment] = useState('PX-RW01: Phân xưởng Rework / Sorting G01'); // c. Bộ phận (cho edit)
  const [workshopWarehouse, setWorkshopWarehouse] = useState(importWarehouse); // d. Mã kho PX (cho edit, mặc định lấy từ kho nhập NVL)

  const [workersCount, setWorkersCount] = useState(2); // Số lượng nhân công (cho phép sửa)
  const [startTime, setStartTime] = useState('08:00 16/10/2026');
  const [endTime, setEndTime] = useState('13:45 16/10/2026');
  const [workHours, setWorkHours] = useState(5.75);
  const [noteDescription, setNoteDescription] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  const isSortingOrder = order?.stage === 'CDSO' || Boolean(order?.products && order?.products.length > 0);

  // Nạp dữ liệu khi mở modal hoặc đổi lệnh
  useEffect(() => {
    if (isOpen && order) {
      const qtyNum = parseFloat(String(order.reworkQty || '20').replace(/,/g, '')) || 20;

      // 1. Bung danh sách các con hàng chính (nếu là Sorting) hoặc NVL theo BOM (nếu là Rework)
      let initialParts = [];
      if (isSortingOrder && order.products && order.products.length > 0) {
        initialParts = order.products.map((item, idx) => {
          const itemQty = parseFloat(String(item.qty || '100').replace(/,/g, '')) || 100;
          return {
            id: idx + 1,
            code: item.itemCode,
            name: item.itemName,
            unit: item.unit || 'Pcs',
            orderQty: itemQty,
            stockQty: item.stockQty !== undefined ? item.stockQty : itemQty * 2,
            okQty: itemQty, // Mặc định điền đủ số lượng đạt theo con hàng
            ngQty: 0,
            note: item.description || '',
          };
        });
      } else {
        const bomItems = getOrderBOM(order.productCode);
        initialParts = bomItems.map((item, idx) => ({
          id: idx + 1,
          code: item.itemCode,
          name: item.itemName,
          unit: item.unit || 'Pcs',
          orderQty: qtyNum,
          stockQty: item.stockQty !== undefined ? item.stockQty : 1246,
          okQty: qtyNum, // Mặc định điền đủ số lượng đạt theo lệnh
          ngQty: 0,
          note: '',
        }));
      }
      setParts(initialParts);

      // 2. Mặc định mã kho phân xưởng lấy từ kho nhập khi lấy NVL link sang
      setWorkshopWarehouse(importWarehouse || 'GS5-PXU-05: Kho TD PX 1B - QV1');

      // 3. Thời gian bắt đầu và kết thúc trên MES
      const start = (order.startTime && order.startTime !== '—') ? order.startTime : '08:00 16/10/2026';
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const end = `${currentHours}:${currentMinutes} 16/10/2026`;

      setStartTime(start);
      setEndTime(end);

      // 4. Tự động tính số giờ làm việc
      const hours = calculateWorkHours(start, end);
      setWorkHours(hours);

      // 5. Ghi chú diễn giải mặc định
      setNoteDescription(`[MES Shopfloor] Nghiệm thu hoàn thành lệnh ${order.stepOrder} — Thời gian chạy: ${hours}h (${start} ➔ ${end})`);
    }
  }, [isOpen, order, importWarehouse]);

  // Lấy phân loại chuẩn từ master (Cố định, không cho sửa)
  const classification = resolveClassification(order?.category);

  // Thao tác cập nhật số lượng OK / NG của từng linh kiện
  const handleUpdateQty = (id, field, value) => {
    const val = Math.max(0, parseFloat(value) || 0);
    setParts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: val };
          return updated;
        }
        return item;
      })
    );
  };

  // Tăng giảm nhanh OK / NG
  const handleStepQty = (id, field, delta) => {
    setParts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const currentVal = item[field] || 0;
          const nextVal = Math.max(0, currentVal + delta);
          return { ...item, [field]: nextVal };
        }
        return item;
      })
    );
  };

  const handleUpdateNote = (id, note) => {
    setParts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, note } : item))
    );
  };

  //  nhanh toàn bộ Đạt 100%
  const handleSetAllOK = () => {
    setParts((prev) =>
      prev.map((item) => ({ ...item, okQty: item.orderQty, ngQty: 0, note: '' }))
    );
  };

  // Đặt toàn bộ về 0
  const handleResetAllToZero = () => {
    setParts((prev) =>
      prev.map((item) => ({ ...item, okQty: 0, ngQty: 0 }))
    );
  };

  // Tính toán tổng hợp KPI
  const totalOrder = parts.reduce((sum, item) => sum + item.orderQty, 0);
  const totalOK = parts.reduce((sum, item) => sum + item.okQty, 0);
  const totalNG = parts.reduce((sum, item) => sum + item.ngQty, 0);
  const totalDone = totalOK + totalNG;
  const passRate = totalDone > 0 ? ((totalOK / totalDone) * 100).toFixed(1) : '100';

  // Lọc tìm kiếm linh kiện (plain filter, không dùng useMemo để đảm bảo an toàn Rules of Hooks)
  const filteredParts = parts.filter((p) => {
    if (!searchFilter.trim()) return true;
    const term = searchFilter.toLowerCase().trim();
    return (
      p.code.toLowerCase().includes(term) ||
      p.name.toLowerCase().includes(term) ||
      (p.note && p.note.toLowerCase().includes(term))
    );
  });

  if (!isOpen || !order) return null;

  const orderQtyNum = parseFloat(String(order?.reworkQty || '0').replace(/,/g, '')) || 0;
  const masterProductStock = getMasterProductStock(order?.productCode, orderQtyNum);
  const isMasterStockSufficient = masterProductStock >= orderQtyNum;

  return (
    <div className="mes-modal-backdrop" onClick={onClose}>
      <div
        className="mes-modal-box mes-complete-order-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header (Flat Matte Enterprise) */}
        <div className="mes-material-header">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[2px] bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Check size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  {isSortingOrder
                    ? 'Nghiệm thu & Hoàn thành Lệnh Sorting (CDSO)'
                    : 'Nghiệm thu & Hoàn thành lệnh công đoạn'}
                </h2>
                <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-[2px]">
                  {order.stepOrder}
                </span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-[2px]">
                  Trạm Sorting/Rework G01
                </span>
                {isSortingOrder && (
                  <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 border border-blue-300 px-2 py-0.5 rounded-[2px]">
                    Không dùng NVL phụ tùng
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {isSortingOrder
                  ? 'Nghiệm thu phân loại các con hàng chính trong lệnh (Không dùng NVL), xác nhận nhân công và thời gian chạy'
                  : 'Nghiệm thu chi tiết linh kiện cấu thành theo BOM, xác nhận nhân công và thời gian chạy thực tế'}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="w-8 h-8 rounded-[2px] border border-slate-300 text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            onClick={onClose}
            title="Đóng cửa sổ"
          >
            <X size={16} />
          </button>
        </div>

        {/* 2. Master Information Form - 2 Columns Layout for Easy Auditing & Cross-Referencing */}
        <div className="bg-slate-50 border-b border-slate-300 px-6 py-3 text-xs flex-shrink-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-2">
            {/* CỘT TRÁI: Phân loại, Lệnh công đoạn, Đối tượng, Mã hàng */}
            <div className="space-y-2">
              {/* 7. Phân loại (THEO MASTER CUNG CẤP - KHÔNG CHO PHÉP SỬA) */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 whitespace-nowrap text-xs w-32 shrink-0 flex items-center gap-1.5">
                  <Lock size={12} className="text-slate-500" />
                  <span>7. Phân loại:</span>
                </span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={classification}
                    className="w-full text-xs font-bold font-mono border border-slate-300 rounded-[2px] px-2.5 py-1.5 bg-slate-200/80 text-slate-800 cursor-not-allowed select-none"
                    title="Phân loại cố định theo Master dữ liệu lệnh công đoạn (Không cho phép sửa)"
                  />
                  <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9.5px] font-bold text-slate-500 bg-slate-300/80 px-1 py-0.2 rounded-[2px]">
                    Khóa
                  </span>
                </div>
              </div>

              {/* 8. Lệnh công đoạn (Khóa theo lệnh chọn) */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 whitespace-nowrap text-xs w-32 shrink-0 flex items-center gap-1.5">
                  <FileText size={13} className="text-blue-700" />
                  <span>8. Lệnh công đoạn:</span>
                </span>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={`${order.stepOrder} (${order.date || '15/10/2026'})`}
                  className="w-full text-xs font-mono font-bold border border-slate-300 rounded-[2px] px-2.5 py-1.5 bg-slate-100 text-blue-900 cursor-not-allowed select-none"
                />
              </div>

              {/* 9. Đối tượng (CHO PHÉP EDIT - CHỌN ĐỐI TƯỢNG) */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 whitespace-nowrap text-xs w-32 shrink-0 flex items-center gap-1.5">
                  <Building size={13} className="text-blue-700" />
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

              {/* b. Mã hàng & Tên thành phẩm (Khóa theo lệnh) */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 whitespace-nowrap text-xs w-32 shrink-0 flex items-center gap-1.5">
                  <Layers size={13} className="text-indigo-700" />
                  <span>b. Mã hàng & SP:</span>
                </span>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={`${order.productCode} — ${order.productName}`}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-[2px] px-2.5 py-1.5 bg-slate-100 text-slate-900 truncate cursor-not-allowed select-none"
                  title={`${order.productCode} — ${order.productName}`}
                />
              </div>

              {/* Tồn kho PX của mã sản phẩm master */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 whitespace-nowrap text-xs w-32 shrink-0 flex items-center gap-1.5">
                  <Warehouse size={13} className="text-emerald-700" />
                  <span>Tồn kho PX:</span>
                </span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 border border-slate-300 rounded-[2px] px-2.5 py-1.5 bg-slate-100 text-slate-800 text-xs font-mono font-bold flex items-center justify-between">
                    <span className="text-[11px] font-sans font-normal text-slate-600 truncate mr-1">
                      Tồn SP <strong className="font-mono text-blue-900">{order.productCode}</strong>:
                    </span>
                    <span className="text-emerald-800 font-extrabold text-[13px] whitespace-nowrap">
                      {Number(masterProductStock).toLocaleString()} Pcs
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-[2px] border flex items-center gap-1 shrink-0 ${
                      isMasterStockSufficient
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-rose-50 text-rose-800 border-rose-300'
                    }`}
                  >
                    {isMasterStockSufficient ? (
                      <>
                        <CheckCircle2 size={11} className="text-emerald-600" />
                        <span>Đủ tồn PX</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={11} className="text-rose-600" />
                        <span>Thiếu tồn</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: Người tạo, Bộ phận, Kho PX, Nhân công & Giờ làm */}
            <div className="space-y-2">
              {/* a. Người tạo phiếu (KHÓA THÊM - CHÍNH LÀ USER TÀI KHOẢN MES) */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 whitespace-nowrap text-xs w-32 shrink-0 flex items-center gap-1.5">
                  <UserCheck size={13} className="text-slate-600" />
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

              {/* c. Bộ phận (CHO PHÉP EDIT - CHỌN TỪ DANH SÁCH BỘ PHẬN) */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 whitespace-nowrap text-xs w-32 shrink-0 flex items-center gap-1.5">
                  <Briefcase size={13} className="text-indigo-700" />
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

              {/* d. Mã kho phân xưởng (CHO PHÉP EDIT - MẶC ĐỊNH LẤY TỪ KHO NHẬP KHI LẤY NVL LINK SANG) */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 whitespace-nowrap text-xs w-32 shrink-0 flex items-center gap-1.5">
                  <Warehouse size={13} className="text-emerald-700" />
                  <span>d. Kho phân xưởng:</span>
                </span>
                <select
                  className="w-full text-xs font-semibold border border-slate-300 rounded-[2px] px-2.5 py-1.5 bg-white text-slate-900 focus:border-blue-600 outline-none cursor-pointer"
                  value={workshopWarehouse}
                  onChange={(e) => setWorkshopWarehouse(e.target.value)}
                  title="Mặc định nhận từ kho nhập khi lấy NVL, cho phép chọn kho khác nếu cần"
                >
                  {WORKSHOP_WAREHOUSE_OPTIONS.map((wh) => (
                    <option key={wh.code} value={wh.name}>
                      {wh.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Số lượng nhân công */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 whitespace-nowrap text-xs w-32 shrink-0 flex items-center gap-1.5">
                  <Users size={13} className="text-emerald-700" />
                  <span>Nhân công:</span>
                </span>
                <div className="flex items-center">
                  <button
                    type="button"
                    className="w-7 h-7 border border-slate-300 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold flex items-center justify-center cursor-pointer rounded-l-[2px]"
                    onClick={() => setWorkersCount((prev) => Math.max(1, prev - 1))}
                    title="Giảm 1 nhân công"
                  >
                    <Minus size={13} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    className="w-14 h-7 border-y border-slate-300 bg-white px-1 text-center text-xs font-bold font-mono text-emerald-800 focus:border-blue-600 outline-none"
                    value={workersCount}
                    onChange={(e) => setWorkersCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    title="Số lượng nhân công"
                  />
                  <button
                    type="button"
                    className="w-7 h-7 border border-slate-300 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-emerald-800 font-bold flex items-center justify-center cursor-pointer rounded-r-[2px]"
                    onClick={() => setWorkersCount((prev) => prev + 1)}
                    title="Tăng 1 nhân công"
                  >
                    <Plus size={13} />
                  </button>
                  <span className="text-[11px] text-slate-500 ml-2">người thực hiện</span>
                </div>
              </div>

              {/* Giờ làm việc */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 whitespace-nowrap text-xs w-32 shrink-0 flex items-center gap-1.5">
                  <Clock size={13} className="text-amber-700" />
                  <span>Giờ làm việc:</span>
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.25"
                    min="0.1"
                    className="w-20 h-7 border border-slate-300 rounded-[2px] bg-white px-2 text-center text-xs font-bold font-mono text-amber-900 focus:border-blue-600 outline-none"
                    value={workHours}
                    onChange={(e) => setWorkHours(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                    title="Số giờ làm việc (h) tính tự động từ giờ bắt đầu đến kết thúc trên MES"
                  />
                  <span className="text-[11px] font-semibold text-slate-700">giờ</span>
                  <span className="text-[10.5px] text-slate-400 font-mono">
                    ({startTime.split(' ')[0]} ➔ {endTime.split(' ')[0]})
                  </span>
                </div>
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
                placeholder="Ghi chú chi tiết quá trình nghiệm thu hoàn thành lệnh..."
              />
            </div>
          </div>
        </div>

        {/* 3. Action & Filter Strip */}
        <div className="bg-white border-b border-slate-300 px-5 py-2 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
       
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                className="pl-7 pr-3 py-1.5 text-xs border border-slate-300 rounded-[2px] bg-white focus:border-blue-600 outline-none w-56 sm:w-64"
                placeholder="Tìm mã hoặc tên NVL con..."
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
              <span>
                {isSortingOrder
                  ? <>Danh sách con hàng: <strong className="text-slate-900 font-bold">{parts.length} con hàng chính</strong></>
                  : <>BOM sử dụng: <strong className="text-slate-900 font-bold">{parts.length} mã NVL</strong></>}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Open Table: Bung chi tiết từng con hàng chính hoặc NVL con */}
        <div className="flex-1 overflow-auto bg-slate-100 p-3">
          {filteredParts.length === 0 ? (
            <div className="p-12 text-center text-slate-500 bg-white border border-slate-300 rounded-[2px]">
              <AlertCircle size={32} className="mx-auto mb-2 text-slate-400" />
              <p className="font-medium text-sm">Không tìm thấy con hàng nào khớp với từ khóa tìm kiếm</p>
            </div>
          ) : (
            <table className="w-full text-xs border-collapse bg-white border border-slate-300 shadow-none">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 text-left">
                  <th className="py-2.5 px-3 text-center w-12 border-r border-slate-200">#</th>
                  <th className="py-2.5 px-3 w-44 border-r border-slate-200">
                    {isSortingOrder ? 'Mã con hàng chính' : 'Mã linh kiện NVL'}
                  </th>
                  <th className="py-2.5 px-3 min-w-[260px] border-r border-slate-200">
                    {isSortingOrder ? 'Tên con hàng chính cấu thành trong lệnh' : 'Tên nguyên vật liệu con cấu thành'}
                  </th>
                  <th className="py-2.5 px-2.5 text-center w-16 border-r border-slate-200">ĐVT</th>
                  <th className="py-2.5 px-3 text-right w-32 border-r border-slate-200 bg-slate-50">
                    {isSortingOrder ? 'SL con hàng theo lệnh' : 'SL theo lệnh'}
                  </th>
                  <th className="py-2.5 px-3 text-center w-52 border-r border-slate-200 bg-emerald-50/50 text-emerald-950">
                    SL Đạt (OK)
                  </th>
                  <th className="py-2.5 px-3 text-center w-52 border-r border-slate-200 bg-rose-50/50 text-rose-950">
                    SL Lỗi (NG)
                  </th>
                  <th className="py-2.5 px-3 text-right w-32 bg-slate-50">
                    Tổng nghiệm thu
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredParts.map((item, idx) => {
                  const itemTotal = (item.okQty || 0) + (item.ngQty || 0);
                  const isMatch = itemTotal === item.orderQty;
                  const hasNG = (item.ngQty || 0) > 0;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-blue-50/30 transition-colors ${hasNG ? 'bg-amber-50/20' : ''
                        }`}
                    >
                      {/* # STT */}
                      <td className="py-2.5 px-3 text-center font-bold text-slate-600 border-r border-slate-200 bg-slate-50/60">
                        {idx + 1}
                      </td>

                      {/* Mã linh kiện */}
                      <td className="py-2.5 px-3 border-r border-slate-200 font-mono font-bold text-blue-900 text-xs">
                        {item.code}
                      </td>

                      {/* Tên linh kiện */}
                      <td className="py-2.5 px-3 border-r border-slate-200 text-slate-900 font-semibold text-[11.5px]">
                        {item.name}
                      </td>

                      {/* Đơn vị tính */}
                      <td className="py-2.5 px-2.5 text-center border-r border-slate-200 text-slate-600 font-medium">
                        {item.unit}
                      </td>

                      {/* SL theo lệnh */}
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 text-[13px] border-r border-slate-200 bg-slate-50/50">
                        {Number(item.orderQty).toLocaleString()}
                      </td>

                      {/* SL Đạt (OK) - Stepper phẳng */}
                      <td className="py-2 px-3 border-r border-slate-200 bg-emerald-50/20">
                        <div className="flex items-center justify-center">
                          <button
                            type="button"
                            className="w-7 h-7 border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center cursor-pointer rounded-l-[2px]"
                            onClick={() => handleStepQty(item.id, 'okQty', -1)}
                            disabled={item.okQty <= 0}
                            title="Giảm 1 OK"
                          >
                            <Minus size={13} />
                          </button>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            className="w-24 h-7 border-y border-emerald-300 bg-white px-2 text-center text-xs font-bold font-mono text-emerald-800 focus:border-emerald-600 outline-none"
                            value={item.okQty}
                            onChange={(e) => handleUpdateQty(item.id, 'okQty', e.target.value)}
                            onFocus={(e) => e.target.select()}
                          />
                          <button
                            type="button"
                            className="w-7 h-7 border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center cursor-pointer rounded-r-[2px]"
                            onClick={() => handleStepQty(item.id, 'okQty', 1)}
                            title="Tăng 1 OK"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </td>

                      {/* SL Lỗi (NG) - Stepper phẳng */}
                      <td className="py-2 px-3 border-r border-slate-200 bg-rose-50/20">
                        <div className="flex items-center justify-center">
                          <button
                            type="button"
                            className="w-7 h-7 border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold flex items-center justify-center cursor-pointer rounded-l-[2px]"
                            onClick={() => handleStepQty(item.id, 'ngQty', -1)}
                            disabled={item.ngQty <= 0}
                            title="Giảm 1 NG"
                          >
                            <Minus size={13} />
                          </button>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            className={`w-24 h-7 border-y bg-white px-2 text-center text-xs font-bold font-mono outline-none ${hasNG
                                ? 'border-rose-400 text-rose-700 bg-rose-50/30'
                                : 'border-slate-300 text-slate-700'
                              }`}
                            value={item.ngQty}
                            onChange={(e) => handleUpdateQty(item.id, 'ngQty', e.target.value)}
                            onFocus={(e) => e.target.select()}
                          />
                          <button
                            type="button"
                            className="w-7 h-7 border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold flex items-center justify-center cursor-pointer rounded-r-[2px]"
                            onClick={() => handleStepQty(item.id, 'ngQty', 1)}
                            title="Tăng 1 NG"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </td>

                      {/* Tổng nghiệm thu (OK+NG) */}
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-xs bg-slate-50/50">
                        <span className={isMatch ? 'text-slate-900' : 'text-amber-700 font-extrabold'}>
                          {itemTotal.toLocaleString()}
                        </span>
                        {!isMatch && (
                          <div className="text-[10px] text-amber-700 font-semibold">
                            (Lệch: {(itemTotal - item.orderQty).toLocaleString()})
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* 5. Sticky Bottom Bar: KPI & Action Buttons */}
        <div className="mes-material-bottom-bar bg-white border-t border-slate-300 px-5 py-2.5 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Tổng theo lệnh:</span>
              <strong className="font-mono text-slate-900 text-sm">{totalOrder.toLocaleString()} Pcs</strong>
            </div>

            <div className="h-4 w-px bg-slate-300" />

            <div className="flex items-center gap-1.5">
              <span className="text-emerald-700 font-bold">Tổng Đạt (OK):</span>
              <strong className="font-mono text-emerald-700 text-sm font-extrabold">{totalOK.toLocaleString()} Pcs</strong>
            </div>

            <div className="h-4 w-px bg-slate-300" />

            <div className="flex items-center gap-1.5">
              <span className="text-rose-700 font-bold">Tổng Lỗi (NG):</span>
              <strong className="font-mono text-rose-700 text-sm font-extrabold">{totalNG.toLocaleString()} Pcs</strong>
            </div>

            <div className="h-4 w-px bg-slate-300" />

            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-medium">Tỷ lệ đạt:</span>
              <span
                className={`font-mono font-bold text-xs px-2 py-0.5 rounded-[2px] border ${parseFloat(passRate) >= 95
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}
              >
                {passRate}%
              </span>
            </div>

            <div className="h-4 w-px bg-slate-300" />

            <div className="flex items-center gap-1.5 text-slate-700">
              <Users size={13} className="text-emerald-700" />
              <span><strong>{workersCount}</strong> nhân công</span>
              <span>·</span>
              <Clock size={13} className="text-amber-700" />
              <span><strong>{workHours}</strong> giờ</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="px-4 py-2 text-xs font-semibold border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 rounded-[2px] cursor-pointer transition-colors"
              onClick={onClose}
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 border border-emerald-800 rounded-[2px] flex items-center gap-1.5 shadow-none cursor-pointer transition-colors"
              onClick={() => {
                onConfirm &&
                  onConfirm({
                    orderId: order.id,
                    stepOrder: order.stepOrder,
                    classification,
                    objectEntity,
                    creatorUser,
                    department,
                    workshopWarehouse,
                    workersCount,
                    workHours,
                    startTime,
                    endTime,
                    totalOK,
                    totalNG,
                    passRate,
                    parts,
                    noteDescription,
                  });
                onClose();
              }}
            >
              <Check size={16} />
              <span>Xác nhận hoàn thành lệnh</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
