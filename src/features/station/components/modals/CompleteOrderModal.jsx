import CompleteOrderMaster from './CompleteOrderMaster';
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
  orders = null,
  importWarehouse = 'GS5-PXU-05: Kho TD PX 1B - QV1',
  onConfirm
}) {
  const [parts, setParts] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [completionMode, setCompletionMode] = useState('partial');

  // Master fields:
  const [objectEntity, setObjectEntity] = useState('GS5.PX1A.03.04: Tổ hoàn thiện hộp'); // 9. Đối tượng (cho edit)
  const creatorUser = 'it06: Hoàng Văn Tuấn (Trạm Sorting/Rework G01)'; // a. Người tạo phiếu (Khóa theo tài khoản MES)
  const [department, setDepartment] = useState('GS5.PX1A.04.02.02: Nhóm TTSX - Tổ hoàn thiện hộp'); // c. Bộ phận (cho edit)
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
      setCompletionMode('partial');
      const qtyNum = Number(String(order.reworkQty ?? '0').replace(/,/g, '')) || 0;
      setQuantity(qtyNum);

      // 1. Bung danh sách các con hàng chính (nếu là Sorting) hoặc NVL theo BOM (nếu là Rework)
      let initialParts = [];
      if (isSortingOrder) {
        initialParts = (orders?.length ? orders : [order]).map(item => {
          const qty = Number(String(item.reworkQty || '0').replace(/,/g, '')) || 0;
          return { id: item.id, code: item.productCode, name: item.productName,
            unit: item.unit || 'Pcs', orderQty: qty, stockQty: item.stockQty ?? qty * 2,
            okQty: qty, ngQty: 0, note: item.stepOrder };
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
  }, [isOpen, order, orders, importWarehouse]);

  // Lấy phân loại chuẩn từ master (Cố định, không cho sửa)
  const classification = isSortingOrder && orders?.length > 1
    ? [...new Set(orders.map(o => resolveClassification(o.category)))].join(' / ')
    : resolveClassification(order?.category);

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
        <header className="completion-compact-header">
          <div className="completion-compact-title"><h2>Hoàn thành lệnh</h2><span>{isSortingOrder ? order.stageOrder || order.stepOrder.replace(/\([^)]*\)$/, '') : order.stepOrder}{isSortingOrder && orders?.length > 1 ? ` · ${orders.length} chi tiết` : ''}</span></div>
          <fieldset className="completion-mode-switch"><legend className="sr-only">Hình thức hoàn thành</legend>
            <label><input type="radio" name="completion-mode" value="partial" checked={completionMode === 'partial'} onChange={() => setCompletionMode('partial')} />Hoàn thành một phần</label>
            <label><input type="radio" name="completion-mode" value="all" checked={completionMode === 'all'} onChange={() => setCompletionMode('all')} />Hoàn thành toàn bộ</label>
          </fieldset>
          <button type="button" className="completion-compact-close" onClick={onClose} title="Đóng cửa sổ" aria-label="Đóng hoàn thành lệnh">×</button>
        </header>

        <CompleteOrderMaster
          order={order} sortingOrders={isSortingOrder ? orders : null} isSortingOrder={isSortingOrder} quantity={quantity} setQuantity={setQuantity} classification={classification} creatorUser={creatorUser}
          objectEntity={objectEntity} setObjectEntity={setObjectEntity}
          department={department} setDepartment={setDepartment}
          workshopWarehouse={workshopWarehouse} setWorkshopWarehouse={setWorkshopWarehouse}
          workersCount={workersCount} setWorkersCount={setWorkersCount}
          workHours={workHours} setWorkHours={setWorkHours}
          noteDescription={noteDescription} setNoteDescription={setNoteDescription}
          startTime={startTime} endTime={endTime} masterProductStock={masterProductStock}
        />

        {/* 3. Action & Filter Strip */}
        <div className="bg-white border-b border-slate-300 px-5 py-2 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
       
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                className="pl-7 pr-3 py-1.5 text-xs border border-slate-300 rounded-[2px] bg-white focus:border-blue-600 outline-none w-56 sm:w-64"
                placeholder={isSortingOrder ? 'Tìm mã hoặc tên hàng...' : 'Tìm mã hoặc tên NVL con...'}
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
                  ? <>Mặt hàng Sorting: <strong className="text-slate-900 font-bold">{parts.length} mặt hàng</strong></>
                  : <>BOM sử dụng: <strong className="text-slate-900 font-bold">{parts.length} mã NVL</strong></>}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Open Table: Bung chi tiết từng con hàng chính hoặc NVL con */}
        <div className="completion-detail-body flex-1 overflow-auto bg-slate-100">
          {filteredParts.length === 0 ? (
            <div className="p-12 text-center text-slate-500 bg-white border border-slate-300 rounded-[2px]">
              <AlertCircle size={32} className="mx-auto mb-2 text-slate-400" />
              <p className="font-medium text-sm">Không tìm thấy con hàng nào khớp với từ khóa tìm kiếm</p>
            </div>
          ) : (
            <table className="completion-detail-grid w-full text-xs border-collapse bg-white shadow-none">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 text-left">
                  <th className="py-2.5 px-3 text-center w-12 border-r border-slate-200">#</th>
                  <th className="py-2.5 px-3 w-44 border-r border-slate-200">
                    {isSortingOrder ? 'Mã hàng' : 'Mã linh kiện NVL'}
                  </th>
                  <th className="py-2.5 px-3 min-w-[260px] border-r border-slate-200">
                    {isSortingOrder ? 'Tên vật tư, hàng hóa' : 'Tên nguyên vật liệu con cấu thành'}
                  </th>
                  <th className="py-2.5 px-2.5 text-center w-16 border-r border-slate-200">ĐVT</th>
                  <th className="py-2.5 px-3 text-right w-32 border-r border-slate-200 bg-slate-50">
                    {isSortingOrder ? 'SL theo chi tiết lệnh' : 'SL theo lệnh'}
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
                    orderIds: isSortingOrder ? parts.map(p => p.id) : [order.id],
                    completionMode,
                    quantity,
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
              <span>{completionMode === 'all' ? 'Xác nhận hoàn thành toàn bộ' : 'Xác nhận hoàn thành một phần'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
