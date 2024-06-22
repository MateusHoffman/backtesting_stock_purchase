import fetchAPI from "../fetch/Fetch";

async function fetchDividendMonth(ticker: any) {
  const url = `https://statusinvest.com.br/acao/companytickerprovents?ticker=${ticker}&chartProventsType=2`;
  const method = "GET";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    Cookie:
      "_adasys=8a9c4d7d-f7e2-4157-9f5a-9b357dc3e93d; G_ENABLED_IDPS=google; cf_clearance=oFL09ajCn2HC2n7daiZVTWI01FonExl9fsjzaK8IqJ4-1684972159-0-160; _gcl_au=1.1.630088004.1685448522; _fbp=fb.2.1687802244255.1322345328; _ga=GA1.3.679689664.1685448523; __hstc=176625274.12517fd7a8c250ffb42e5b0dd214337c.1687802271698.1687802271698.1687802271698.1; hubspotutk=12517fd7a8c250ffb42e5b0dd214337c; _ga_69GS6KP6TJ=GS1.1.1687802244.2.1.1687802297.7.0.0; .StatusInvest=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJBY2NvdW50SWQiOiI0NTAyNDgiLCJOYW1lIjoiTWF0ZXVzIEhvZmZtYW4iLCJFbWFpbCI6Im1hdGV1c2hvZmZtYW5wcm9AZ21haWwuY29tIiwiSW50ZXJmYWNlVHlwZSI6IldlYiIsIklwIjoiOjpmZmZmOjEwLjEwMC4xMC4xMzciLCJuYmYiOjE2ODc5NDM4ODUsImV4cCI6MTY4ODAzMDI4NSwiaWF0IjoxNjg3OTQzODg1LCJpc3MiOiJTdGF0dXNJbnZlc3QiLCJhdWQiOiJTdGF0dXNJbnZlc3QifQ.xX_v-2MZzZaziY9mY8T7GTTBpujFZxZo2f1Ph0-xy89lxBv2Nub0JvL1kIXkppk1z6upHuOjUwYP-noCiOQfmA; .StatusInvestAd=1; __cf_bm=25O1ju7BZo0kjqWCHQN0ChveNAPO.i6efYsDC3OMEuQ-1688591157-0-AQSAXxCq2iwsz6+zivmSpcDC+XtqaUGiEBXFk9qo6J3guUAsOA95x0VQr4rP2fg1nw==",
    Origin: "https://statusinvest.com.br",
    Referer: "https://statusinvest.com.br/acoes/VIVT3",
    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  };

  const response = await fetchAPI(url, { method, headers });
  return response.assetEarningsModels;
}

function formatDividendMonth(dividendHistory: any) {
  return dividendHistory.map((div: any) => ({
    dateCom: div.ed,
    payday: div.pd,
    value: div.v,
  }));
}

export default async function getAllDividendsMonth(ticker: any) {
  const dataDividendMonth = await fetchDividendMonth(ticker);
  const formattedDividendMonth = formatDividendMonth(dataDividendMonth);
  return formattedDividendMonth;
}
