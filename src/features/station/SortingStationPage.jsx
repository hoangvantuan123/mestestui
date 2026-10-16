import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import SubHeaderFilter from './components/SubHeaderFilter';
import SortingOrdersTable from './components/SortingOrdersTable';
import PaginationBar from './components/PaginationBar';
import BottomActionBar from './components/BottomActionBar';
import FooterStatus from './components/FooterStatus';
import {
  OrderDetailModal,
  ChangeMachineModal,
  EndShiftModal,
  DefectModal,
  SortingQuickScanModal,
  CompleteSortingModal,
  MaterialModal,
  CompleteOrderModal,
} from './components/modals';
import {
  initialRunningSortingOrders,
  initialCompletedSortingOrders,
} from './data/mockSortingOrders';

export default function SortingStationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [runningOrders, setRunningOrders] = useState(initialRunningSortingOrders);
  const [completedOrders, setCompletedOrders] = useState(initialCompletedSortingOrders);

  // Station info
  const [currentMachine, setCurrentMachine] = useState('SORT-G01');
  const [stationName, setStationName] = useState('Trạm Sorting Phân Loại G01');
  const [stationStatus, setStationStatus] = useState('Sẵn sàng');
  const [shiftTeam, setShiftTeam] = useState(location.state?.shiftTeam || null);
  const [metrics, setMetrics] = useState({
    quantity: '0 Pcs',
    speed: '—',
    teamSpeed: '0 NG',
  });

  // Navigation & filtering state
  const [activeTab, setActiveTab] = useState('running'); // 'running' | 'completed'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Selection & pagination state
  const [selectedOrderId, setSelectedOrderId] = useState(1);
  const [checkedOrderIds, setCheckedOrderIds] = useState([1]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Modals state
  const [isQuickScanOpen, setIsQuickScanOpen] = useState(false);
  const [isMaterialOpen, setIsMaterialOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [completionOrders, setCompletionOrders] = useState([]);
  const [isDefectOpen, setIsDefectOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isMachineOpen, setIsMachineOpen] = useState(false);
  const [isEndShiftOpen, setIsEndShiftOpen] = useState(false);
  const [inspectingOrder, setInspectingOrder] = useState(null);
  const [currentWorkshopWarehouse, setCurrentWorkshopWarehouse] = useState('GS5-PXU-05: Kho TD PX 1B - QV1');

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'info') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Current active dataset
  const activeOrdersList = activeTab === 'running' ? runningOrders : completedOrders;

  // Filtered dataset
  const filteredOrders = useMemo(() => {
    return activeOrdersList.filter((item) => {
      // Search term filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchStep = item.stepOrder?.toLowerCase().includes(query);
        const matchLot = item.lotNo?.toLowerCase().includes(query);
        const matchProdCode = item.productCode?.toLowerCase().includes(query);
        const matchProdName = item.productName?.toLowerCase().includes(query);
        const matchCat = item.category?.toLowerCase().includes(query);
        const matchDesc = item.description?.toLowerCase().includes(query);
        const matchTray = item.currentTray?.toLowerCase().includes(query);
        if (!matchStep && !matchLot && !matchProdCode && !matchProdName && !matchCat && !matchDesc && !matchTray) {
          return false;
        }
      }
      // Status filter
      if (statusFilter && item.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [activeOrdersList, searchTerm, statusFilter]);

  // Paginated dataset
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  // Find currently selected order object
  const activeOrder = useMemo(() => {
    return activeOrdersList.find((o) => o.id === selectedOrderId) || activeOrdersList[0];
  }, [activeOrdersList, selectedOrderId]);

  // Find all currently checked orders for multi-order operations
  const selectedOrders = useMemo(() => {
    if (checkedOrderIds && checkedOrderIds.length > 0) {
      const checked = activeOrdersList.filter((o) => checkedOrderIds.includes(o.id));
      if (checked.length > 0) return checked;
    }
    return activeOrder ? [activeOrder] : [];
  }, [activeOrdersList, checkedOrderIds, activeOrder]);

  // Handlers
  const handleSelectOrder = (order) => {
    setSelectedOrderId(order.id);
  };

  const handleToggleCheckOrder = (id) => {
    setCheckedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleCheckAll = () => {
    const pageIds = paginatedOrders.map((o) => o.id);
    const allChecked = pageIds.every((id) => checkedOrderIds.includes(id));
    if (allChecked) {
      setCheckedOrderIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setCheckedOrderIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleOpenOrderDetail = (order) => {
    setInspectingOrder(order);
    setIsDetailOpen(true);
  };

  const handleOpenQuickScan = (order) => {
    if (order) setSelectedOrderId(order.id);
    setIsQuickScanOpen(true);
  };

  // Actions
  const handleStartOrder = () => {
    if (!activeOrder) return;
    setRunningOrders((prev) =>
      prev.map((o) => (o.id === activeOrder.id ? { ...o, status: 'Đang chạy' } : o))
    );
    setStationStatus('Đang chạy');
    showToast(`Đã bắt đầu thực hiện lệnh Sorting: ${activeOrder.stepOrder}`, 'success');
  };

  const handlePauseOrder = () => {
    if (!activeOrder) return;
    setRunningOrders((prev) =>
      prev.map((o) => (o.id === activeOrder.id ? { ...o, status: 'Tạm dừng' } : o))
    );
    setStationStatus('Tạm dừng');
    showToast(`Đã tạm dừng lệnh Sorting: ${activeOrder.stepOrder}`, 'warning');
  };

  const handleCompleteOrder = () => {
    const selected = selectedOrders.filter(o => runningOrders.some(r => r.id === o.id));
    if (!selected.length) return showToast('Chọn chi tiết lệnh đang thực hiện để hoàn thành.', 'warning');
    const masters = new Set(selected.map(o => o.stageOrder || o.stepOrder.replace(/\([^)]*\)$/, '')));
    if (masters.size !== 1) return showToast('Vui lòng chọn các chi tiết thuộc cùng một lệnh công đoạn.', 'warning');
    setCompletionOrders(selected);
    setIsCompleteModalOpen(true);
  };

  const handleCompleteConfirm = (data) => {
    const ids = new Set(data.orderIds || [data.orderId]);
    const targets = runningOrders.filter(o => ids.has(o.id));
    if (!targets.length) return;
    const time = new Date().toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit' });
    const record = o => {
      const part = data.parts.find(p => p.id === o.id);
      const report = { ...data, orderId: o.id, stepOrder: o.stepOrder, parts: [part], totalOK: part?.okQty || 0, totalNG: part?.ngQty || 0 };
      return { ...o, completionReports: [...(o.completionReports || []), report],
        status: data.completionMode === 'all' ? 'Hoàn thành' : o.status === 'Chờ' ? 'Đang chạy' : o.status,
        ...(data.completionMode === 'all' ? { endTime: time } : {}) };
    };
    if (data.completionMode === 'all') {
      setRunningOrders(prev => prev.filter(o => !ids.has(o.id)));
      setCompletedOrders(prev => [...targets.map(record), ...prev]);
      setCheckedOrderIds(prev => prev.filter(id => !ids.has(id)));
    } else setRunningOrders(prev => prev.map(o => ids.has(o.id) ? record(o) : o));
    setMetrics(prev => ({ ...prev, quantity: `${data.totalOK} Pcs` }));
    showToast(`Đã ghi nhận ${data.completionMode === 'all' ? 'toàn bộ' : 'một phần'} cho ${targets.length} chi tiết của lệnh ${targets[0].stageOrder || targets[0].stepOrder}`, 'success');
  };

  const handleMaterialConfirm = (data) => {
    if (data?.importWarehouse) {
      setCurrentWorkshopWarehouse(data.importWarehouse);
    }
    showToast(`Đã ghi nhận xuất NVL cho lệnh ${activeOrder?.stepOrder}`, 'success');
  };

  const handleDefectConfirm = (data) => {
    showToast(`Đã lưu kết quả phân loại: Đạt ${data.goodQty}, Lỗi ${data.defectQty}`, 'info');
  };

  const handleQuickScanConfirm = (data) => {
    if (!activeOrder) return;

    setRunningOrders((prev) =>
      prev.map((o) => {
        if (o.id === activeOrder.id) {
          const newGood = (Number(o.goodQty) || 0) + (Number(data.goodIncrement) || 0);
          const newDefect = (Number(o.defectQty) || 0) + (Number(data.totalDefectIncrement) || 0);
          const newSorted = newGood + newDefect;
          const newPassRate = newSorted > 0 ? ((newGood / newSorted) * 100).toFixed(2) : '100.00';

          const newDefects = {
            dust: (o.defects?.dust || 0) + (data.defectCounts?.dust || 0),
            scratch: (o.defects?.scratch || 0) + (data.defectCounts?.scratch || 0),
            dent: (o.defects?.dent || 0) + (data.defectCounts?.dent || 0),
            bubble: (o.defects?.bubble || 0) + (data.defectCounts?.bubble || 0),
          };

          return {
            ...o,
            goodQty: newGood,
            defectQty: newDefect,
            sortedQty: newSorted,
            passRate: newPassRate,
            currentTray: data.currentTray || o.currentTray,
            defects: newDefects,
            status: 'Đang chạy',
          };
        }
        return o;
      })
    );

    setMetrics((prev) => ({
      ...prev,
      quantity: `${((Number(activeOrder.sortedQty) || 0) + (Number(data.goodIncrement) || 0) + (Number(data.totalDefectIncrement) || 0)).toLocaleString('vi-VN')} Pcs`,
    }));

    showToast(
      `Đã cập nhật kết quả: +${data.goodIncrement} Đạt (OK), +${data.totalDefectIncrement} Lỗi (NG)`,
      'success'
    );
  };

  const handleChangeOrderSeq = () => {
    if (!activeOrder) return;
    setRunningOrders((prev) => {
      const remaining = prev.filter((o) => o.id !== activeOrder.id);
      return [activeOrder, ...remaining];
    });
    showToast(`Đã đưa lệnh Sorting ${activeOrder.stepOrder} lên vị trí ưu tiên đầu tiên!`, 'info');
  };

  const handleMachineSelect = (mach) => {
    setCurrentMachine(mach.id);
    setShiftTeam(mach.team ? { name: mach.team, leader: mach.leader, count: mach.members.length } : null);
    setStationName(mach.name);
    if (mach.type !== 'sorting') {
      showToast(`Chuyển sang ${mach.name}...`, 'info');
      navigate(`/${mach.type}`, { state: { shiftTeam: mach.team ? { name: mach.team, leader: mach.leader, count: mach.members.length } : null } });
    } else {
      showToast(`Đã chuyển sang vận hành máy: ${mach.id} - ${mach.name}`, 'info');
    }
  };

  const handleChangeTray = () => {
    if (!activeOrder) return;
    const nextTrayNum = Math.floor(Math.random() * 5) + 1;
    const newTray = `TRAY-0${nextTrayNum}/15`;
    setRunningOrders((prev) =>
      prev.map((o) => (o.id === activeOrder.id ? { ...o, currentTray: newTray } : o))
    );
    showToast(`Đã chuyển sang khay mới: ${newTray}`, 'info');
  };

  const handleEndShiftConfirm = () => {
    showToast('Đã kết thúc ca làm việc trạm Sorting thành công.', 'info');
  };

  return (
    <div className="mes-station-container">
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`mes-toast-notification toast-${toastMessage.type}`}>
          {toastMessage.msg}
        </div>
      )}

      {/* 1. Header (Deep Navy) with Station Type Switcher */}
      <Header
        stationType="sorting"
        activeOrder={activeOrder}
        stationName={stationName}
        currentMachine={currentMachine}
        status={stationStatus}
        metrics={metrics}
        onRefresh={() => showToast('Đã làm mới dữ liệu trạm Sorting.', 'info')}
        onOpenChangeMachine={() => setIsMachineOpen(true)}
      />

      {/* 2. Sub-Header: Tabs & Filter Bar */}
      <SubHeaderFilter
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setCurrentPage(1);
        }}
        runningCount={runningOrders.length}
        completedCount={completedOrders.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        onSearchSubmit={() => {}}
      />

      {/* 3. Main Sorting Data Table */}
      <main className="mes-table-section">
        <SortingOrdersTable
          orders={paginatedOrders}
          selectedOrderId={activeOrder?.id}
          onSelectOrder={handleSelectOrder}
          checkedOrderIds={checkedOrderIds}
          onToggleCheckOrder={handleToggleCheckOrder}
          onToggleCheckAll={handleToggleCheckAll}
          onOpenOrderDetail={handleOpenOrderDetail}
          stationType="sorting"
        />
      </main>

      {/* 4. Pagination */}
      <PaginationBar
        totalCount={filteredOrders.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(sz) => {
          setPageSize(sz);
          setCurrentPage(1);
        }}
      />

      {/* 5. Bottom Action Circular Buttons (Đồng bộ chức năng như Rework) */}
      <BottomActionBar
        activeOrder={activeOrder}
        onStartOrder={handleStartOrder}
        onCompleteOrder={handleCompleteOrder}
        completionCount={selectedOrders.filter(o => runningOrders.some(r => r.id === o.id)).length}
        onGetMaterial={() => setIsMaterialOpen(true)}
        onFinishDefect={() => setIsDefectOpen(true)}
        onReceiveLTT={() => showToast('Tiếp nhận lệnh thao tác thành công.', 'info')}
        onPauseOrder={handlePauseOrder}
        onMachineOperate={() => showToast('Vận hành máy: Trạng thái máy bình thường.', 'info')}
        onChangeOrderSeq={handleChangeOrderSeq}
        onPrintLabel={() => showToast('Đang gửi lệnh in tem tới máy in nhiệt...', 'info')}
      />

      {/* 6. Footer Status */}
      <FooterStatus
        team={shiftTeam?.name || 'TỔ SORTING ST01'}
        leader={shiftTeam?.leader || '—'}
        members={shiftTeam ? String(shiftTeam.count) : '—'}
        shiftStart="08:00 16/10/2026"
        onChangeMachine={() => setIsMachineOpen(true)}
        onEndShift={() => setIsEndShiftOpen(true)}
      />

      {/* Modals */}
      <MaterialModal
        isOpen={isMaterialOpen}
        onClose={() => setIsMaterialOpen(false)}
        order={activeOrder}
        orders={selectedOrders}
        onConfirm={handleMaterialConfirm}
      />

      <CompleteOrderModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        order={completionOrders[0] || activeOrder}
        orders={completionOrders}
        importWarehouse={currentWorkshopWarehouse}
        onConfirm={handleCompleteConfirm}
      />

      <DefectModal
        isOpen={isDefectOpen}
        onClose={() => setIsDefectOpen(false)}
        order={activeOrder}
        onConfirm={handleDefectConfirm}
      />

      <OrderDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        order={inspectingOrder || activeOrder}
      />

      <ChangeMachineModal
        isOpen={isMachineOpen}
        onClose={() => setIsMachineOpen(false)}
        currentMachine={currentMachine}
        onSelectMachine={handleMachineSelect}
      />

      <EndShiftModal
        isOpen={isEndShiftOpen}
        onClose={() => setIsEndShiftOpen(false)}
        onConfirm={handleEndShiftConfirm}
      />
    </div>
  );
}
