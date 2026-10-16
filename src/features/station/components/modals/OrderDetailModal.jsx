import React, { useState } from 'react';
import { X } from 'lucide-react';
import { getOrderBOM } from '../../data/bomData';

export default function OrderDetailModal({ isOpen, onClose, order }) {
  const [activeMainTab, setActiveMainTab] = useState('materials');
  const [activeSubTab, setActiveSubTab] = useState('requisition');

  if (!isOpen || !order) return null;

  const bomItems = getOrderBOM(order.productCode) || [];
  const qtyNum = parseFloat(String(order.reworkQty || '20').replace(/,/g, '')) || 20;

  const isSortingOrder = order.stage === 'CDSO' || (order.products && order.products.length > 0);
  const sortingProducts = order.products || [];

  return (
    <div className="mes-modal-backdrop" onClick={onClose}>
      <div className="mes-modal-box mes-order-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header with ✕ and title */}
        <div className="mes-detail-modal-header">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="detail-modal-close-icon"
              onClick={onClose}
              title="Đóng cửa sổ"
            >
              <X size={18} />
            </button>
            <h2 className="detail-modal-title">
              Chi tiết — <span className="font-bold text-slate-900">{order.stepOrder}</span> ·{' '}
              <span className="text-slate-700">{order.category || 'Sorting (nội bộ)'}</span>
            </h2>
          </div>
          <button
            type="button"
            className="mes-modal-close"
            onClick={onClose}
            title="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Level 1 Tabs */}
        <div className="detail-main-tabs">
          <button
            type="button"
            className={`detail-tab-btn ${activeMainTab === 'materials' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('materials')}
          >
            {isSortingOrder
              ? `Danh sách con hàng chính (${sortingProducts.length || 1})`
              : `Chi tiết vật liệu (${bomItems.length})`}
          </button>
          <button
            type="button"
            className={`detail-tab-btn ${activeMainTab === 'instruction' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('instruction')}
          >
            Yêu cầu công đoạn
          </button>
          <button
            type="button"
            className={`detail-tab-btn ${activeMainTab === 'drawings' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('drawings')}
          >
            Bản vẽ (0)
          </button>
          <button
            type="button"
            className={`detail-tab-btn ${activeMainTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('tasks')}
          >
            Chi tiết task
          </button>
          <button
            type="button"
            className={`detail-tab-btn ${activeMainTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('specs')}
          >
            Thông số kỹ thuật
          </button>
          <button
            type="button"
            className={`detail-tab-btn ${activeMainTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('history')}
          >
            Lịch sử
          </button>
        </div>

        {/* Tab 1: Chi tiết vật liệu / Con hàng chính */}
        {activeMainTab === 'materials' && (
          <div className="detail-tab-content">
            {/* Sub-tabs */}
            <div className="detail-sub-tabs">
              <button
                type="button"
                className={`detail-subtab-btn ${activeSubTab === 'requisition' ? 'active' : ''}`}
                onClick={() => setActiveSubTab('requisition')}
              >
                {isSortingOrder
                  ? `Con hàng trong lệnh (${sortingProducts.length || 1})`
                  : `NVL cần lĩnh (${bomItems.length})`}
              </button>
              <button
                type="button"
                className={`detail-subtab-btn ${activeSubTab === 'myTickets' ? 'active' : ''}`}
                onClick={() => setActiveSubTab('myTickets')}
              >
                Phiếu của tôi
              </button>
            </div>

            {/* Sub-tab 1 */}
            {activeSubTab === 'requisition' && (
              <div className="materials-table-wrapper">
                {isSortingOrder ? (
                  <>
                    <div className="p-2 mb-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 flex items-center justify-between">
                      <span className="font-semibold">
                        Lệnh Sorting không sử dụng NVL phụ tùng. Lệnh bao gồm {sortingProducts.length} con hàng chính cấu thành bên dưới:
                      </span>
                      <span className="font-mono font-bold">Tổng SL: {order.reworkQty} Pcs</span>
                    </div>
                    <table className="materials-data-table">
                      <thead>
                        <tr>
                          <th className="col-num text-center">#</th>
                          <th>Mã con hàng chính</th>
                          <th>Tên con hàng chính</th>
                          <th className="text-right">SL Cần Sort</th>
                          <th className="text-center">Đơn vị</th>
                          <th className="text-center">Loại hàng</th>
                          <th>Tiêu chuẩn kiểm tra ngoại quan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortingProducts.map((item, idx) => (
                          <tr key={item.itemCode}>
                            <td className="text-center font-mono text-slate-500">{idx + 1}</td>
                            <td className="font-mono font-bold text-blue-900">{item.itemCode}</td>
                            <td className="font-medium text-slate-800">{item.itemName}</td>
                            <td className="text-right font-mono font-bold text-slate-900">
                              {item.qty?.toLocaleString('vi-VN')}
                            </td>
                            <td className="text-center text-slate-600">{item.unit || 'Pcs'}</td>
                            <td className="text-center">
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                Con hàng chính
                              </span>
                            </td>
                            <td className="text-slate-600 text-xs">
                              {item.description || 'Kiểm tra ngoại quan 100%'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <table className="materials-data-table">
                    <thead>
                      <tr>
                        <th className="col-num text-center">#</th>
                        <th>Mã VL</th>
                        <th>Tên VL</th>
                        <th className="text-right">SL cần</th>
                        <th className="text-center">Đơn vị</th>
                        <th className="text-center">TT lấy VL</th>
                        <th className="text-center">VL chính</th>
                        <th className="text-right">Tồn kho</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bomItems.length > 0 ? (
                        bomItems.map((item, idx) => (
                          <tr key={item.itemCode}>
                            <td className="text-center">{idx + 1}</td>
                            <td className="font-mono font-medium text-blue-900">{item.itemCode}</td>
                            <td className="font-medium text-slate-800">{item.itemName}</td>
                            <td className="text-right font-mono font-bold text-slate-900">{qtyNum.toFixed(2)}</td>
                            <td className="text-center text-slate-600">{item.unit || 'Pcs'}</td>
                            <td className="text-center">
                              <span className="text-[10.5px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                Chờ xuất
                              </span>
                            </td>
                            <td className="text-center">
                              {idx === 0 ? (
                                <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                                  Chính
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 font-mono">—</span>
                              )}
                            </td>
                            <td className="text-right font-mono text-slate-600">1,246.00</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="text-center py-6 text-slate-400">
                            Không có dữ liệu NVL cho con hàng này.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Sub-tab 2: Phiếu của tôi */}
            {activeSubTab === 'myTickets' && (
              <div className="materials-empty-state">
                <span className="empty-state-text">Chưa có phiếu xuất lĩnh nào được tạo cho lệnh này</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Yêu cầu công đoạn */}
        {activeMainTab === 'instruction' && (
          <div className="detail-tab-content p-4 text-xs space-y-3">
            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg">
              <div className="font-bold text-sm text-blue-900 mb-1">
                Quy trình Rework công đoạn: {order.stage}
              </div>
              <p className="text-slate-600 mb-0">
                Lệnh thao tác đối ứng phân loại và khắc phục các lỗi kỹ thuật trước khi đóng gói nhập kho.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                Nội dung diễn giải & Chỉ đạo sản xuất:
              </h4>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-700 font-medium">
                {order.description}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 border border-slate-200 rounded">
                <span className="font-semibold text-slate-700 block mb-1">Tiêu chuẩn kiểm tra ngoại quan:</span>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>Kiểm tra 100% bề mặt linh kiện, không trầy xước, dính bẩn</li>
                  <li>Loại bỏ sản phẩm bị cong vênh, rách hoặc gãy góc</li>
                  <li>Dán nhãn change code và kiểm tra mã vạch rõ ràng</li>
                </ul>
              </div>
              <div className="p-3 border border-slate-200 rounded">
                <span className="font-semibold text-slate-700 block mb-1">Yêu cầu giao hàng:</span>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>Đối ứng giao hàng Samsung / Shinwoo đúng tiến độ DO</li>
                  <li>Phân loại riêng thùng hàng đạt và hàng lỗi NG</li>
                  <li>Ký biên bản nghiệm thu trước khi chuyển kho</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Bản vẽ */}
        {activeMainTab === 'drawings' && (
          <div className="detail-tab-content flex flex-col items-center justify-center p-10 text-slate-400">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-2"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span className="text-xs text-slate-500">Chưa có bản vẽ kỹ thuật đính kèm</span>
          </div>
        )}

        {/* Tab 4: Chi tiết task */}
        {activeMainTab === 'tasks' && (
          <div className="detail-tab-content p-4 text-xs space-y-3">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block">Số lệnh công đoạn:</span>
                <strong className="text-slate-900 font-mono text-sm">{order.stepOrder}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Trạng thái:</span>
                <strong className="text-amber-700 font-semibold">{order.status}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Ngày tạo lệnh:</span>
                <strong className="font-mono text-slate-800">{order.date}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Công đoạn:</span>
                <strong className="text-blue-700">{order.stage}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Mã sản phẩm (Rework):</span>
                <strong className="font-mono text-slate-800">{order.productCode}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Tên sản phẩm (Rework):</span>
                <strong className="font-mono text-slate-900">{order.productName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Số lượng cần Rework:</span>
                <strong className="font-mono text-base text-amber-800">{order.reworkQty}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Máy gán:</span>
                <strong className="text-slate-800 font-mono">{order.machine || 'SORT-G01'}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Thông số kỹ thuật */}
        {activeMainTab === 'specs' && (
          <div className="detail-tab-content p-4 text-xs space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-center">
                <span className="text-slate-500 block text-xs">Phòng thao tác</span>
                <strong className="text-slate-800 font-semibold">Cleanroom Class 10,000</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-center">
                <span className="text-slate-500 block text-xs">Nhiệt độ tiêu chuẩn</span>
                <strong className="text-slate-800 font-mono">22°C ± 2°C</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-center">
                <span className="text-slate-500 block text-xs">Độ ẩm</span>
                <strong className="text-slate-800 font-mono">55% ± 5%</strong>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Lịch sử */}
        {activeMainTab === 'history' && (
          <div className="detail-tab-content p-4 text-xs space-y-2">
            <div className="flex items-start gap-3 p-2.5 rounded border-b border-slate-100">
              <span className="font-mono text-slate-400 w-28 flex-shrink-0">16/10/2026 08:30</span>
              <div>
                <strong className="text-slate-800 block">Tiếp nhận trạm vận hành</strong>
                <span className="text-slate-500">Người thực hiện: HOÀNG VĂN TUẤN tại SORT-G01</span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2.5 rounded border-b border-slate-100">
              <span className="font-mono text-slate-400 w-28 flex-shrink-0">{order.date} 08:00</span>
              <div>
                <strong className="text-slate-800 block">Khởi tạo lệnh công đoạn {order.stepOrder}</strong>
                <span className="text-slate-500">Phân loại: {order.category}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
