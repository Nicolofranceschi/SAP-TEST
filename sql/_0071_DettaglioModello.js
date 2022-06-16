import { getOrdineProduzione, getModello, getOrdiniLavorazione, getOrdineCliente, getCommessa, getTecnologia, getAttachment, getLega, getElencoFasi } from "../utils/getOrdineProduzione.js";

export async function _0071_DettaglioModello(docnum,conn) {
  const OrdineProduzione = await getOrdineProduzione(docnum);
  const lineoc = parseInt(OrdineProduzione.value[0].Project.split('-')[2]); //C000957-2190147-0000

  const [Modello, OrdiniLavorazione, OrdineCliente, Commessa] = await Promise.all([getModello(OrdineProduzione), getOrdiniLavorazione(OrdineProduzione), getOrdineCliente(OrdineProduzione), getCommessa(OrdineProduzione)]);

  const [Tecnologia, Attachment, Lega, ElencoFasi] = await Promise.all([getTecnologia(Modello), getAttachment(Modello), getLega(OrdineCliente, lineoc), getElencoFasi(conn)]);

  const lblOrdCliente = OrdineCliente.value[0].CardCode + " - " + OrdineCliente.value[0].CardName;
  const lblOrdClienteNumero = OrdineProduzione.value[0].Project.split('-')[1];
  const _DocDate = new Date(OrdineCliente.value[0].DocDate);
  const _ShipDate = new Date(OrdineCliente.value[0].DocumentLines[lineoc].ShipDate);
  const lblOrdClienteData = _DocDate.getDate() + "-" + (_DocDate.getMonth() + 1) + "-" + _DocDate.getFullYear();
  const lblOrdClienteConsegna = _ShipDate.getDate() + "-" + (_ShipDate.getMonth() + 1) + "-" + _ShipDate.getFullYear();
  const lblProgetto = OrdineProduzione.value[0].Project;
  const lblModelloDescr = Modello.U_ModCode + " - " + Modello.U_DescMod;
  const lblModelloPM = String(Modello.U_PesMed);
  const lblModelloNF = String(Modello.U_NumFig);
  const lblModelloLG = Modello.U_CodLega + " - " + Lega.Name;
  const lblModelloTC = Modello.U_CodTecnl + " - " + Tecnologia.Name;
  const lblQtaOP = String(parseInt(OrdineProduzione.value[0].PlannedQuantity));
  const ciclo_oc = OrdineCliente.value[0].DocumentLines[lineoc].U_METAL_CICLO.trim();
  const fase_op = OrdineProduzione.value[0].U_METAL_Fase;
  const item_op = OrdineProduzione.value[0].ItemNo;

  const arr = Commessa.METAL_MOD71GCollection;
  const ElencoFasiCiclo = Object.fromEntries(arr.map(o => [parseInt(o.U_CodSeq), o]));
  const FaseAttualeArticolo = arr.reverse().find(({ U_CodCicLa, U_CodArt }) => U_CodCicLa === ciclo_oc && U_CodArt === item_op);
  const ciclo_co = arr[arr.length - 1].U_CodCicLa.trim();
  const item_co = arr[arr.length - 1].U_CodArt.trim();
  const array_fasi = Object.values(ElencoFasiCiclo);
  const indice_faseattuale = array_fasi.findIndex(({ U_CodCicLa, U_CofFasLa }) => ciclo_oc + fase_op === U_CodCicLa + U_CofFasLa);
  const faseprecedente = indice_faseattuale === 0 ? null : array_fasi[indice_faseattuale];
  const fasesuccessiva = indice_faseattuale === array_fasi.length - 1 ? null : array_fasi[indice_faseattuale + 1];
  const faseattuale = array_fasi[indice_faseattuale];

  const getLabels = (fase) => ({
    nome: fase !== null ? `${fase.U_CofFasLa} - ${ElencoFasi[fase.U_CofFasLa]}` : '',
    ie: fase !== null ? `${fase.U_FlagIE[0] == 'I' ? "INTERNA" : "ESTERNA"}` : ''
  })

  const lblFaseAttNome = getLabels(faseattuale).nome;
  const lblFaseAttIE = getLabels(faseattuale).ie;

  const lblFasePrecNome = getLabels(faseprecedente).nome;
  const lblFasePrecIE = getLabels(faseprecedente).ie;

  const lblFaseSuccNome = getLabels(fasesuccessiva).nome;
  const lblFaseSuccIE = getLabels(fasesuccessiva).ie;

  return {
    lblOrdCliente,
    lblOrdClienteNumero,
    lblOrdClienteData,
    lblOrdClienteConsegna,
    lblProgetto,
    lblModelloDescr,
    lblModelloPM,
    lblModelloNF,
    lblModelloLG,
    lblModelloTC,
    lblQtaOP,
    lblFaseAttNome,
    lblFaseAttIE,
    lblFasePrecNome,
    lblFasePrecIE,
    lblFaseSuccNome,
    lblFaseSuccIE,
    ciclo_oc,
    ciclo_co,
    item_op,
    item_co,
    fase_op,
    ElencoFasiCiclo,
    Attachment,
    Lega,
    Tecnologia,
    OrdiniLavorazione,
    OrdineProduzione,
    Commessa,
    ElencoFasi,
    Modello,
    lineoc,
    FaseAttualeArticolo
  }
}