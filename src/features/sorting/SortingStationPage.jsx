import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import SubHeaderFilter from './components/SubHeaderFilter';
import SortingTable from './components/SortingTable';
import PaginationBar from './components/PaginationBar';
import BottomActionBar from './components/BottomActionBar';
import FooterStatus from './components/FooterStatus';
import {
  MaterialModal,
  DefectModal,
  CompleteOrderModal,
  OrderDetailModal,
  ChangeMachineModal,
  EndShiftModal,
} from './components/modals';
import { initialRunningOrders, initialCompletedOrders } from './data/mockOrders';

export default function SortingStationPage() {
  const [runningOrders, setRunningOrders] = useState(initialRunningOrders);
  const [completedOrders, setCompletedOrders] = useState(initialCompletedOrders);

  // Station info
  const [currentMachine, setCurrentMachine] = useState('SORT-G01');
  const [stationName, setStationName] = useState('Trạm Sorting/Rework G01');
  const [stationStatus, setStationStatus] = useState('Sẵn sàng');
  const [metrics, setMetrics] = useState({ quantity: '0 CT', speed: '0 /h', teamSpeed: '0 /h' });

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

  // Modal dialog states
  const [isMaterialOpen, setIsMaterialOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isDefectOpen, setIsDefectOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isMachineOpen, setIsMachineOpen] = useState(false);
  const [isEndShiftOpen, setIsEndShiftOpen] = useState(false);
  const [inspectingOrder, setInspectingOrder] = useState(null);

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
        const matchProdCode = item.productCode?.toLowerCase().includes(query);
        const matchProdName = item.productName?.toLowerCase().includes(query);
        const matchCat = item.category?.toLowerCase().includes(query);
        const matchDesc = item.description?.toLowerCase().includes(query);
        const matchStage = item.stage?.toLowerCase().includes(query);
        if (!matchStep && !matchProdCode && !matchProdName && !matchCat && !matchDesc && !matchStage) {
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

  // Actions
  const handleStartOrder = () => {
    if (!activeOrder) return;
    setRunningOrders((prev) =>
      prev.map((o) => (o.id === activeOrder.id ? { ...o, status: 'Đang chạy' } : o))
    );
    setStationStatus('Đang chạy');
    showToast(`Đã bắt đầu thực hiện lệnh: ${activeOrder.stepOrder}`, 'success');
  };

  const handlePauseOrder = () => {
    if (!activeOrder) return;
    setRunningOrders((prev) =>
      prev.map((o) => (o.id === activeOrder.id ? { ...o, status: 'Tạm dừng' } : o))
    );
    setStationStatus('Tạm dừng');
    showToast(`Đã tạm dừng lệnh: ${activeOrder.stepOrder}`, 'warning');
  };

  const handleCompleteOrder = () => {
    if (!activeOrder) return;
    setIsCompleteModalOpen(true);
  };

  const handleCompleteConfirm = (data) => {
    const completed = {
      ...activeOrder,
      status: 'Hoàn thành',
      endTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };
    setRunningOrders((prev) => prev.filter((o) => o.id !== activeOrder.id));
    setCompletedOrders((prev) => [completed, ...prev]);
    setMetrics((prev) => ({
      ...prev,
      quantity: `${data.totalOK} CT`,
    }));
    showToast(
      `Đã hoàn thành lệnh ${activeOrder.stepOrder}: Đạt ${data.totalOK} Pcs, Lỗi ${data.totalNG} Pcs (Tỉ lệ đạt ${data.passRate}%)`,
      'success'
    );
  };

  const handleChangeOrderSeq = () => {
    // Reverse or prioritize first
    if (!activeOrder) return;
    setRunningOrders((prev) => {
      const remaining = prev.filter((o) => o.id !== activeOrder.id);
      return [activeOrder, ...remaining];
    });
    showToast(`Đã đưa lệnh ${activeOrder.stepOrder} lên vị trí ưu tiên đầu tiên!`, 'info');
  };

  const handleMachineSelect = (machId) => {
    setCurrentMachine(machId);
    setStationName(`Trạm ${machId}`);
    showToast(`Đã chuyển sang vận hành máy: ${machId}`, 'info');
  };

  const [currentWorkshopWarehouse, setCurrentWorkshopWarehouse] = useState('GS5-PXU-05: Kho TD PX 1B - QV1');

  const handleMaterialConfirm = (data) => {
    if (data?.importWarehouse) {
      setCurrentWorkshopWarehouse(data.importWarehouse);
    }
    showToast(`Đã ghi nhận xuất NVL cho lệnh ${activeOrder?.stepOrder}`, 'success');
  };

  const handleDefectConfirm = (data) => {
    showToast(`Đã lưu kết quả phân loại: Đạt ${data.goodQty}, Lỗi ${data.defectQty}`, 'info');
  };

  const handleEndShiftConfirm = () => {
    showToast('Đã kết thúc ca làm việc thành công.', 'info');
  };

  return (
    <div className="mes-station-container">
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`mes-toast-notification toast-${toastMessage.type}`}>
          {toastMessage.msg}
        </div>
      )}

      {/* 1. Header (Deep Navy) */}
      <Header
        activeOrder={activeOrder}
        stationName={stationName}
        status={stationStatus}
        metrics={metrics}
        onRefresh={() => showToast('Đã làm mới dữ liệu trạm.', 'info')}
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

      {/* 3. Main Data Table */}
      <main className="mes-table-section">
        <SortingTable
          orders={paginatedOrders}
          selectedOrderId={activeOrder?.id}
          onSelectOrder={handleSelectOrder}
          checkedOrderIds={checkedOrderIds}
          onToggleCheckOrder={handleToggleCheckOrder}
          onToggleCheckAll={handleToggleCheckAll}
          onOpenOrderDetail={handleOpenOrderDetail}
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

      {/* 5. Bottom Action Circular Buttons */}
      <BottomActionBar
        activeOrder={activeOrder}
        onStartOrder={handleStartOrder}
        onCompleteOrder={handleCompleteOrder}
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
        team="TỔ SX G01"
        leader="—"
        members="—"
        shiftStart="10:23 16/10/2026"
        onChangeMachine={() => setIsMachineOpen(true)}
        onEndShift={() => setIsEndShiftOpen(true)}
      />

      {/* Dialogs */}
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
        order={activeOrder}
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
