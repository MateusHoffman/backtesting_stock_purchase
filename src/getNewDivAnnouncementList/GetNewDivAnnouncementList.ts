export default function getNewDivAnnouncementList(
  listDiv: any,
  date: string,
  stockPosition: any
): any {
  const filteredByDate = listDiv.filter((div: any) => {
    return div.dateCom === date;
  });
  if (filteredByDate.length) {
    let listDivToReceive: any = []
    // Calcula quanto de div der receber de acordo com a quantidade de ação
    filteredByDate.forEach((divAnnouncement: any) => {
      const stock = stockPosition.find(
        (stock: any) => stock.ticker === divAnnouncement.ticker
      );
      if (stock) {
        const newDivToReceive = {
          ...divAnnouncement,
          totalValue: divAnnouncement.value * stock.totalQuantity,
        };
        listDivToReceive.push(newDivToReceive);
      }
    });
    return listDivToReceive || []
  }
  return []
}
