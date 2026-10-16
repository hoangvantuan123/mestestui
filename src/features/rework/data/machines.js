// Machine definitions for MES Factory Line (Rework vs Sorting)

export const MACHINE_TYPES = {
  REWORK: 'rework',
  SORTING: 'sorting',
};

export const AVAILABLE_MACHINES = [
  // --- NHÓM MÁY REWORK ---
  {
    id: 'RWK-G01',
    name: 'Trạm Rework Sửa chữa G01',
    type: MACHINE_TYPES.REWORK,
    typeName: 'Máy Rework',
    workshop: 'Xưởng 1B - Line G01',
    status: 'Sẵn sàng',
    operator: 'Hoàng Văn Tuấn',
    activeOrderCode: 'CDRE-0626-0008',
    description: 'Chuyên gia công, sửa chữa lỗi ngoại quan & thay thế NVL cụm linh kiện',
  },

  // --- NHÓM MÁY SORTING ---
  {
    id: 'SORT-G01',
    name: 'Trạm Sorting Phân loại Ngoại quan G01',
    type: MACHINE_TYPES.SORTING,
    typeName: 'Máy Sorting',
    workshop: 'Xưởng QC - Line ST01',
    status: 'Sẵn sàng',
    operator: 'Vũ Thị Hạnh',
    activeOrderCode: 'CDST-0626-0012',
    description: 'Sorting phân loại ngoại quan hàng lỗi, kiểm tra kích thước & độ phẳng',
  },
];

export function getMachineById(id) {
  return AVAILABLE_MACHINES.find((m) => m.id === id) || AVAILABLE_MACHINES[0];
}
