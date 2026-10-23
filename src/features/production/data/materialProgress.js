export function materialProgress(order, requests = {}) {
  const quantity = requests[order.id]?.[order.productCode] || 0;
  if (quantity <= 0) return { quantity: 0, label: 'Chưa lấy NVL', tone: 'waiting' };
  if (quantity < order.plannedQty) return { quantity, label: 'Đã lấy một phần', tone: 'partial' };
  return { quantity, label: 'Đã lấy đủ', tone: 'received' };
}
