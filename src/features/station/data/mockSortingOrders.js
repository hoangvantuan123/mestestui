// Sorting: mỗi dòng là một chi tiết lệnh thao tác, chỉ có một mặt hàng.
const makeSortingDetail = (id, detailNumber, productCode, productName, quantity, category, stageOrder = 'CDSO-0726-0062') => ({
  id, stage: 'CDSO', stageOrder,
  stepOrder: `${stageOrder}(${detailNumber})`,
  operationOrder: `${stageOrder}(${detailNumber})`,
  detailNumber, replacementDeclaration: '',
  date: '—', status: 'Chờ', category,
  operation: 'Phân loại', productCode, productName,
  reworkQty: String(quantity), targetQty: quantity, productionQty: quantity,
  unit: 'Pcs', machine: 'SORT-G01', partCount: 1, isSampleOrder: false,
  description: category, operationStart: '—', operationEnd: '—',
  startTime: '—', endTime: '—', machineRunTime: '00:00', lastOperation: '—',
});

export const initialRunningSortingOrders = [
  makeSortingDetail(1, 552, 'HEM-HMI-00064', 'EP-P2900TBEGWW-UNIT BOX', 3400, 'Phân loại'),
  makeSortingDetail(2, 551, 'HEM-HMI-00074', 'EP-T1510NWEGEU', 1254, 'Sorting - Hàng bán bị trả lại (RMA)'),
  makeSortingDetail(3, 550, 'HEM-HMI-00083', 'EP-P2900BBJGJP-UNIT BOX', 300, 'Sorting - Nội bộ'),
];
// Số lượng mẫu cho các chi tiết bổ sung, dùng để thử giao diện.
initialRunningSortingOrders.push(
  makeSortingDetail(4, 524, 'DRE-HMW-00354', 'Hộp 84463 (FSC mix 70%)-04', 1200, 'Sorting - Nội bộ', 'CDSO-0726-0060'),
  makeSortingDetail(5, 523, 'HEM-HMI-00074', 'EP-T1510NWEGEU', 850, 'Sorting - Nội bộ', 'CDSO-0726-0060'),
  makeSortingDetail(6, 477, 'DRE-HMW-00383', 'Hộp 93323 (FSC mix 70%)-01', 2000, 'Sorting - Nội bộ', 'CDSO-0726-0053'),
  makeSortingDetail(7, 476, 'DRE-HMW-00384', 'Hộp 69086 (FSC mix 70%)-05', 1500, 'Sorting - Nội bộ', 'CDSO-0726-0053'),
);
export const initialCompletedSortingOrders = [];
