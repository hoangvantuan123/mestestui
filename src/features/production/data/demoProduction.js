// Dữ liệu minh họa từ hoan-thanh-nvl.html, chỉ dùng trong bộ nhớ.
export const productionOrders = [
  {
    "id": "CD05-0926-0743",
    "status": "Đang chạy",
    "code": "CD05-0926-0743(512)",
    "operation": "Thao tác bế sóng",
    "productCode": "HAN - FSE - 00289",
    "productName": "PM02-003491F",
    "goodQty": 381,
    "plannedQty": 400,
    "unit": "Pcs",
    "machine": "HN-BE-TC01",
    "parts": "1.0",
    "note": "—",
    "start": "20:28 23/09"
  },
  {
    "id": "CD02-0926-0415",
    "status": "Tạm dừng",
    "code": "CD02-0926-0415(890)",
    "operation": "Thao tác bế sóng",
    "productCode": "SMN - FSA - 00065",
    "productName": "MHC-101YN",
    "goodQty": 126,
    "plannedQty": 135,
    "unit": "Pcs",
    "machine": "HN-BE-TC01",
    "parts": "1.0",
    "note": "—",
    "start": "09:13 22/09"
  },
  {
    "id": "CD02-0926-0415-889",
    "status": "Tạm dừng",
    "code": "CD02-0926-0415(889)",
    "operation": "Thao tác bế sóng",
    "productCode": "SMN - FSA - 00060",
    "productName": "EUCS-301",
    "goodQty": 146,
    "plannedQty": 156,
    "unit": "Pcs",
    "machine": "HN-BE-TC01",
    "parts": "1.0",
    "note": "—",
    "start": "08:42 22/09"
  },
  {
    "id": "CD03-0926-0162",
    "status": "Tạm dừng",
    "code": "CD03-0926-0162(571)",
    "operation": "Thao tác bế sóng",
    "productCode": "BTP - FAB - 00197",
    "productName": "Lixil - 136155SH00 - Insert 1",
    "goodQty": 1000,
    "plannedQty": 1021,
    "unit": "Pcs",
    "machine": "HN-BE-TC01",
    "parts": "2.0",
    "note": "—",
    "start": "09:12 16/09"
  },
  {
    "id": "CD04-0726-0058-327",
    "status": "Chờ",
    "code": "CD04-0726-0058(327)",
    "operation": "Thao tác bế sóng",
    "productCode": "LTK - KAB - 00002",
    "productName": "LGES TWINS-Length Partition, MBMS (LGES TWINS) (mẫu)",
    "goodQty": 30,
    "plannedQty": 30,
    "unit": "Pcs",
    "machine": "HN-BE-TC01",
    "parts": "—",
    "note": "—",
    "start": "—"
  },
  {
    "id": "CD04-0726-0058-329",
    "status": "Chờ",
    "code": "CD04-0726-0058(329)",
    "operation": "Thao tác bế sóng",
    "productCode": "LTK - KAB - 00002",
    "productName": "LGES TWINS-Length Partition, MBMS (LGES TWINS) (mẫu)",
    "goodQty": 30,
    "plannedQty": 30,
    "unit": "Pcs",
    "machine": "HN-BE-TC01",
    "parts": "—",
    "note": "—",
    "start": "—"
  }
];
// Cùng cấu trúc dữ liệu để dùng lại giao diện máy bế sóng.
const rollCuttingProducts = [
  ['CD01-0826-0020(670)', 'PHO-2LE-04293', 'GS5 - Phôi-BDL-2E-MINHAN125-HHV150-845x1085', 'Tấm'],
  ['CD01-0826-0020(671)', 'GTO-WOF-00333', 'WF-IK-Indonesia-D70-860x470', 'Tờ'],
  ['CD01-0826-0020(672)', 'GTO-ART-00076', 'ART-D100-630X450', 'Tờ'],
  ['CD01-0826-0015(650)', 'GTO-DPT-08134', 'DUP-XSD-D350-850x890', 'Tờ'],
  ['CD01-0826-0015(641)', 'GTO-DPT-07208', 'DUP-Thái Lan-D250-1280x760', 'Tờ'],
  ['CD01-0826-0015(642)', 'GTO-DPT-00546', 'DUP-JIULONG-D300-1210X1345', 'Tờ'],
];
export const rollCuttingOrders = productionOrders.map((order, index) => ({
  ...order,
  id: rollCuttingProducts[index][0],
  code: rollCuttingProducts[index][0],
  operation: ['Xả cuộn', 'Chia cuộn', 'Chia tờ'][index % 3],
  productCode: rollCuttingProducts[index][1],
  productName: rollCuttingProducts[index][2],
  machine: 'HN-XC-01',
  unit: rollCuttingProducts[index][3],
  start: order.start === '—' ? '—' : '08:00 23/10',
}));

export const errorCodes = [
            { code: 'NG-001', name: 'Rách / hỏng vật tư' },
            { code: 'NG-002', name: 'Sai kích thước' },
            { code: 'NG-003', name: 'Lỗi bế / lệch khuôn' },
            { code: 'NG-004', name: 'Bẩn / ố vàng / dính keo' },
            { code: 'NG-005', name: 'Móp méo / biến dạng' },
            { code: 'NG-006', name: 'Lỗi in / lem màu' },
            { code: 'NG-000', name: 'Lỗi khác' }
        ];
export const departments = [
            { code: 'SX-CARTON', name: 'Tổ HT Carton GSHN' },
            { code: 'SX-IN', name: 'Phân xưởng In' },
            { code: 'SX-SONG', name: 'Phân xưởng Tạo sóng' },
            { code: 'KHO-NVL', name: 'Kho Nguyên Vật Liệu' },
            { code: 'QC-KCS', name: 'Phòng Quản lý chất lượng (QC)' },
            { code: 'KT-CODIEN', name: 'Phòng Cơ điện - Bảo trì' },
            { code: 'NCC-VATTU', name: 'Nhà cung cấp vật tư' },
            { code: 'GS0.HCNS.01.03.03', name: 'Nhân sự' }
        ];
export const productionMaterials = [
            { 
                code: 'BTP-BSA-00013', 
                name: 'Canon - G12-QX2-6352-002-01-01', 
                unit: 'Tấm', 
                used: 1510, 
                stock: 1530, 
                original: '1800001',
                errors: [
                    { code: 'NG-001', name: 'Rách / hỏng vật tư', qty: 19, deptCode: 'SX-CARTON', deptName: 'Tổ HT Carton GSHN' }
                ]
            },
            { 
                code: 'BTP-BSA-00014', 
                name: 'Canon - G12-QX2-6352-002-01-01', 
                unit: 'Tấm', 
                used: 1510, 
                stock: 1530, 
                original: '1800041',
                errors: [
                    { code: 'NG-001', name: 'Rách / hỏng vật tư', qty: 19, deptCode: 'SX-CARTON', deptName: 'Tổ HT Carton GSHN' }
                ]
            }
        ];
export const fmt = n => new Intl.NumberFormat('vi-VN', {maximumFractionDigits: 2}).format(n);
