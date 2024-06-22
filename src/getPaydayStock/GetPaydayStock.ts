export default function getPaydayStock(listDivToReceive: any, date: string) {
  const filteredByDate = listDivToReceive.filter((div: any) => {
    return div.payday === date;
  });
  const totalSum = filteredByDate.reduce(
    (sum: any, item: any) => sum + item.totalValue,
    0
  );
  return totalSum;
}
