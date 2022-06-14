
import { getOrdineProduzione, getModello, getOrdiniLavorazione, getOrdineCliente, getCommessa, getTecnologia, getAttachment, getLega, getElencoFasi } from "../utiles/getOrdineProduzione.js";

export async function _0071_DettaglioModello(docnum,conn) {
    try {
  
      console.log("🚀 ~ file: query.js ~ line 224 ~ _0071_DettaglioModello ~ docnum", docnum)
  
      const OrdineProduzione = await getOrdineProduzione(docnum);
      console.log("🚀 ~ file: query.js ~ line 233 ~ _0071_DettaglioModello ~ OrdineProduzione", OrdineProduzione)
  
      const lineoc = parseInt(OrdineProduzione.value[0].Project.split('-')[2]); //C000957-2190147-0000
  
      const [Modello, OrdiniLavorazione, OrdineCliente, Commessa] = await Promise.all([getModello(OrdineProduzione), getOrdiniLavorazione(OrdineProduzione), getOrdineCliente(OrdineProduzione), getCommessa(OrdineProduzione)]);
      console.log("🚀 ~ file: query.js ~ line 239 ~ _0071_DettaglioModello ~  Commessa", Commessa)
      console.log("🚀 ~ file: query.js ~ line 239 ~ _0071_DettaglioModello ~ OrdineCliente", OrdineCliente)
      console.log("🚀 ~ file: query.js ~ line 239 ~ _0071_DettaglioModello ~ Modello", Modello)
  
  
      const [Tecnologia, Attachment, Lega, ElencoFasi] = await Promise.all([getTecnologia(Modello), getAttachment(Modello), getLega(OrdineCliente, lineoc), getElencoFasi(conn)]);
      console.log("🚀 ~ file: query.js ~ line 245 ~ _0071_DettaglioModello ~  ElencoFasi", ElencoFasi)
      console.log("🚀 ~ file: query.js ~ line 245 ~ _0071_DettaglioModello ~ Lega", Lega)
      console.log("🚀 ~ file: query.js ~ line 245 ~ _0071_DettaglioModello ~ Attachment", Attachment)
      console.log("🚀 ~ file: query.js ~ line 245 ~ _0071_DettaglioModello ~ Tecnologia", Tecnologia)
  
      const lblOrdCliente = OrdineCliente.value[0].CardCode + " - " + OrdineCliente.value[0].CardName;
      console.log("🚀 ~ file: query.js ~ line 252 ~ _0071_DettaglioModello ~ lblOrdCliente", lblOrdCliente)
      const lblOrdClienteNumero = OrdineProduzione.value[0].Project.split('-')[1];
      console.log("🚀 ~ file: query.js ~ line 254 ~ _0071_DettaglioModello ~ lblOrdClienteNumero", lblOrdClienteNumero)
      const _DocDate = new Date(OrdineCliente.value[0].DocDate);
      console.log("🚀 ~ file: query.js ~ line 256 ~ _0071_DettaglioModello ~ _DocDate", _DocDate)
      const _ShipDate = new Date(OrdineCliente.value[0].DocumentLines[lineoc].ShipDate);
      console.log("🚀 ~ file: query.js ~ line 258 ~ _0071_DettaglioModello ~ _ShipDate", _ShipDate)
      const lblOrdClienteData = _DocDate.getDate() + "-" + (_DocDate.getMonth() + 1) + "-" + _DocDate.getFullYear();
      console.log("🚀 ~ file: query.js ~ line 258 ~ _0071_DettaglioModello ~ lblOrdClienteData", lblOrdClienteData)
      const lblOrdClienteConsegna = _ShipDate.getDate() + "-" + (_ShipDate.getMonth() + 1) + "-" + _ShipDate.getFullYear();
      console.log("🚀 ~ file: query.js ~ line 260 ~ _0071_DettaglioModello ~  lblOrdClienteConsegna", lblOrdClienteConsegna)
      const lblProgetto = OrdineProduzione.value[0].Project;
      console.log("🚀 ~ file: query.js ~ line 263 ~ _0071_DettaglioModello ~ lblProgetto", lblProgetto)
      const lblModelloDescr = Modello.U_ModCode + " - " + Modello.U_DescMod;
      console.log("🚀 ~ file: query.js ~ line 265 ~ _0071_DettaglioModello ~ lblModelloDescr", lblModelloDescr)
      const lblModelloPM = String(Modello.U_PesMed);
      console.log("🚀 ~ file: query.js ~ line 267 ~ _0071_DettaglioModello ~ lblModelloPM", lblModelloPM)
      const lblModelloNF = String(Modello.U_NumFig);
      console.log("🚀 ~ file: query.js ~ line 269 ~ _0071_DettaglioModello ~ lblModelloNF", lblModelloNF)
      const lblModelloLG = Modello.U_CodLega + " - " + Lega.Name;
      console.log("🚀 ~ file: query.js ~ line 271 ~ _0071_DettaglioModello ~ lblModelloLG", lblModelloLG)
      const lblModelloTC = Modello.U_CodTecnl + " - " + Tecnologia.Name;
      console.log("🚀 ~ file: query.js ~ line 273 ~ _0071_DettaglioModello ~ lblModelloTC", lblModelloTC)
      const lblQtaOP = String(parseInt(OrdineProduzione.value[0].PlannedQuantity));
      console.log("🚀 ~ file: query.js ~ line 275 ~ _0071_DettaglioModello ~ lblQtaOP", lblQtaOP)
      const ciclo_oc = OrdineCliente.value[0].DocumentLines[lineoc].U_METAL_CICLO.trim();
      console.log("🚀 ~ file: query.js ~ line 278 ~ _0071_DettaglioModello ~ ciclo_oc", ciclo_oc)
      const fase_op = OrdineProduzione.value[0].U_METAL_Fase;
      console.log("🚀 ~ file: query.js ~ line 280 ~ _0071_DettaglioModello ~ fase_op", fase_op)
      const item_op = OrdineProduzione.value[0].ItemNo;
      console.log("🚀 ~ file: query.js ~ line 282 ~ _0071_DettaglioModello ~ item_op", item_op)
      let ElencoFasiCiclo = new Map();
      let FaseAttualeArticolo = null;
      
      console.log("🚀 ~ file: _0071_DettaglioModello.js ~ line 65 ~ _0071_DettaglioModello ~ Commessa.METAL_MOD71GCollection.Count", Commessa.METAL_MOD71GCollection.length,Commessa.METAL_MOD71GCollection)
      for (let i = 0; i < Commessa.METAL_MOD71GCollection.length; i++) {
          let ciclo_co = Commessa.METAL_MOD71GCollection[i].U_CodCicLa.trim();
          let item_co = Commessa.METAL_MOD71GCollection[i].U_CodArt.trim();
          let seq = parseInt(Commessa.METAL_MOD71GCollection[i].U_CodSeq);
          if (!ElencoFasiCiclo.has(seq))
          ElencoFasiCiclo.set(seq, Commessa.METAL_MOD71GCollection[i]);
          if (Commessa.METAL_MOD71GCollection[i].U_CodCicLa == ciclo_oc && Commessa.METAL_MOD71GCollection[i].U_CodArt == item_op )
          FaseAttualeArticolo = Commessa.METAL_MOD71GCollection[i];
        }
        
        console.log("🚀 ~ file: _0071_DettaglioModello.js ~ line 60 ~ _0071_DettaglioModello ~ FaseAttualeArticolo", FaseAttualeArticolo)
      console.log("elencofasi",ElencoFasiCiclo)
    } catch (error) {
      console.error(error)
    }
  
  
    //sono arrivato a linea 119 del file 0071
  }