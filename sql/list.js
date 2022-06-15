import { getUnitadimisura } from "./test.js";


export async function list(conn, date, fase) {

    const [{ U_UmTempi }] = await getUnitadimisura(conn);
    const factor = U_UmTempi === "M" ? 60 * 60 : 60;
    const sqlfase = fase ? `AND OWOR."U_METAL_Fase" = '${fase}'` : '';
    const sqldate = '2022-04-29';

    const sql = `
    SELECT
    DISTINCT '0' || '-' || OLV0."Code"|| '-' || OLV0."LineId"SKEY,
    OWOR."DocNum"ORDINE_PRODUZIONE,
    OLV0."U_DataProgr"DATA,
    CAST(OLV1.U_TMPPR AS INT) / ${factor},
    CAST(OLV1.U_TMPMD AS INT) / ${factor},
    CAST(OLV1.U_TMPFM AS INT) / ${factor},
    CAST(OLV1.U_TMPAT AS INT) / ${factor},
    OLV1.U_NUMOP,
    OLV0.U_CANCL,
    OLV0.U_CHIUSO,
CASE
        WHEN OFAS."U_FlgAnime"<> 'N' THEN OITM."ItemCode"|| ' (Anima)'
        ELSE COALESCE(OMOD."U_ModCode", '')
    END MODELLO -- 
,
    COALESCE(ORDR."CardCode", '') || ' ' || COALESCE(ORDR."CardName", '') CLIENTE,
    ORDR."DocNum"ORDCLI,
    ORDR."DocDate"ORDCLIDT,
    CAST(OLV0."U_Quantita"AS INT) QTAORD,
    '' EMPLO,
    COALESCE(OFAS."Code", '') || ' ' || COALESCE(OFAS."Name", '') FASE,
CASE
        WHEN COALESCE(OLV0."U_Impianto", '') = '' THEN ''
        WHEN OIMP."Code"IS NULL THEN OLV0."U_Impianto"|| ' Non Presente'
        ELSE OIMP."Code"|| ' ' || COALESCE(OIMP."Name", '')
    END IMPIANTO,
    COALESCE(OMOD."U_ModCode", '') || ' ' || COALESCE(OMOD."U_DescMod", '') MODELLO_FULL -- 
,
    OLV0."U_PSRIG"PESO_LORDO,
    OLV0."U_PSMED"PESO_MEDIO,
    OLV1."U_Stf_BI"STAFFE_BI,
    OLV1."U_Stf_OK"STAFFE_OK,
    OITM."ItemCode"|| ' ' || OITM."ItemName"ITEM,
    COALESCE(OLV0."U_Sequenza", 0) SEQUENZA,
    OMOD."U_CodLega"CODICE_LEGA,
    CAST(OMOD."U_NumFig"AS INT) NUMERO_FIGURE,
    MPPP."CodPlacca"CODICE_PLACCA,
    MPPP."NumAnime"NUM_ANIME,
    MPPP."PesoStaffa"PESO_STAFFA,
    OLV1."U_QtaProd"QUANTITA
FROM
   "@METAL_OLV0"OLV0
    INNER JOIN"@METAL_OOLV"OOLV ON OOLV."Code"= OLV0."Code"
    INNER JOIN OWOR OWOR ON OOLV."U_DocEntryOP"= OWOR."DocEntry"
    INNER JOIN OITM OITM ON OWOR."ItemCode"= OITM."ItemCode"
    LEFT OUTER JOIN"@METAL_OMOD"OMOD ON OWOR."U_METAL_MDLL"= OMOD."Code"
    LEFT OUTER JOIN RDR1 ON OWOR."Project"= RDR1."Project"
    LEFT OUTER JOIN ORDR ON RDR1."DocEntry"= ORDR."DocEntry"
    LEFT OUTER JOIN"@METAL_OFAS"OFAS ON OWOR."U_METAL_Fase"= OFAS."Code"
    LEFT OUTER JOIN (
        SELECT
           "Code",
           "U_COD0",
            SUM("U_Stf_BI")"U_Stf_BI",
            SUM("U_Stf_OK")"U_Stf_OK",
            SUM("U_QtaProd")"U_QtaProd",
            COALESCE(SUM(CAST(U_TMPMD AS INT)), 0) U_TMPMD,
            COALESCE(SUM(CAST(U_TMPFM AS INT)), 0) U_TMPFM,
            COALESCE(SUM(CAST(U_TMPAT AS INT)), 0) U_TMPAT,
            COALESCE(SUM(U_NUMOP), 0) U_NUMOP,
            COALESCE(SUM(CAST(U_TMPPR AS INT)), 0) U_TMPPR
        FROM
           "@METAL_OLV1"
        WHERE
           "U_COD0"IS NOT NULL
        GROUP BY
           "Code",
           "U_COD0"
    ) OLV1 ON OLV0."Code"= OLV1."Code"
    AND OLV0."LineId"= OLV1."U_COD0"
    LEFT OUTER JOIN"@METAL_OIMP"OIMP ON OLV0."U_Impianto"= OIMP."Code"
    LEFT OUTER JOIN METAL_PIANO_PRODUZIONE_PRINT MPPP ON OOLV."U_DocEntryOP"= MPPP."DocEntry"
    AND OLV0."U_DataProgr"= MPPP."Dt_DProgr"
    AND OLV0."U_Sequenza"= MPPP."U_METAL_Seq"
    WHERE OLV0."U_DataProgr"='${sqldate}'  AND OLV0.U_CHIUSO = 'N' ${sqlfase}
    ORDER BY  DATA, SEQUENZA
    `;
    return conn.exec(sql);
}
