import { apiCall} from './app.js';

export function getOrdineProduzione(docnum) {
  const query = `ProductionOrders?$filter=DocumentNumber eq ${docnum}`;
  return apiCall(query);
}
export function getModello(OrdineProduzione) {
  const U_METAL_MDLL = OrdineProduzione.value[0].U_METAL_MDLL;
  const query = `METAL_OMOD('${U_METAL_MDLL}')`;
  return apiCall(query);
}
// OTTENGO OrdiniLavorazione da OrdiniProduzione ( AbsoluteEntry )
export function getOrdiniLavorazione(OrdineProduzione) {
  const AbsoluteEntry = OrdineProduzione.value[0].AbsoluteEntry;
  const query = `METAL_OOLV?$filter=U_DocEntryOP eq '${AbsoluteEntry}'`;
  return apiCall(query);
}
// OTTENGO Ordine Cliente da OrdineProduzione ( Project.split('-')[1] )
export function getOrdineCliente(OrdineProduzione) {
  const ProjectDocNum = OrdineProduzione.value[0].Project.split('-')[1];
  const query = `Orders?$filter=DocNum eq ${ProjectDocNum} `;
  return apiCall(query);
}
export function getCommessa(OrdineProduzione) {
  const Project = OrdineProduzione.value[0].Project;
  const query = `METAL_MOD7G('${Project}')`;
  return apiCall(query);
}
// OTTENGO Tecnologia da Modello ( UCodTecnl )
export function getTecnologia(Modello) {
  const U_CodTecnl = Modello.U_CodTecnl;
  const query = `METAL_OTCL('${U_CodTecnl}')`;
  return apiCall(query);
}
// OTTENGO Attachment da Modello ( UAtcEntry )
export function getAttachment(Modello) {
  const U_AtcEntry = Modello.U_AtcEntry;
  const query = `Attachments2(${U_AtcEntry})`;
  return (U_AtcEntry > 0) ? apiCall(query) : null;
}
// OTTENGO Lega da OrdineProduzione e OrdineCliente
export function getLega(OrdineCliente, lineoc) {
  const U_METAL_LEGA = OrdineCliente.value[0].DocumentLines[lineoc].U_METAL_LEGA;
  const query = `METAL_OLEG('${U_METAL_LEGA}')`;
  return apiCall(query);
}
// Ottengo ElencoFasi [SQL]
export async function getElencoFasi(conn) {
  const sql = `SELECT "Code", "Name" FROM "@METAL_OFAS"`;
  const res = await conn.exec(sql);
  return res.reduce((acc, { code, name }) => ({ ...acc, [code]: name }), {});
}
