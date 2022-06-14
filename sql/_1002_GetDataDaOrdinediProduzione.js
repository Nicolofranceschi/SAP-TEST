
export function _1002_GetDataDaOrdinediProduzione(docnum,conn) {
  const sql = `
    SELECT
      OMOD."U_ModCode" || ' ' || OMOD."U_DescMod" "MODELLO",
      ORDR."CardCode" || ' ' || ORDR."CardName" "CLIENTE",
      TO_NVARCHAR(RDR1."ShipDate", 'DD/MM/YYYY') "DATACONSEGNA",
      CASE
        WHEN OFAS."Code" = '~~' THEN 'Fine Produzione'
        ELSE OFAS."Code" || ' ' || OFAS."Name"
      END "FASE",
      CASE
        WHEN OFAS."Code" = '~~' THEN 'V'
        ELSE 'C'
      END TIPO,
      RDR1."Quantity" QTA,
      RDR1."OpenQty" OPENQTY,
      ORDR."DocNum" DOCNUM,
      CASE
        WHEN OFAS."U_FlgAnime" <> 'N' THEN MMOD5."U_PesUnAn"
        ELSE OMOD."U_PesMed"
      END PESOMEDIO,
      CASE
        WHEN OFAS."U_FlgColata" <> 'N' THEN OMOD."U_PesLrd"
        ELSE 0
      END PESOLORDO,
      M71G."U_FlagIE" FLAGIE,
      OFAS."U_FlgColata" COLATA,
      CASE
        WHEN OITM."U_METAL_TIPO" = 'F' AND (
            OFAS."U_FlgAnime" <> 'N' OR OFAS."U_FlgColata" <> 'N'
          ) THEN
          CASE
            WHEN COALESCE(OMOD."U_NumFig", 1) = 0 THEN 1
            ELSE COALESCE(OMOD."U_NumFig", 1)
          END
        WHEN OITM."U_METAL_TIPO" = 'A' AND (
            OFAS."U_FlgAnime" <> 'N' OR OFAS."U_FlgColata" <> 'N'
          ) THEN
          CASE
            WHEN COALESCE(MMOD5."U_NumFig", 1) = 0 THEN 1
            ELSE COALESCE(MMOD5."U_NumFig", 1)
          END
        ELSE 1
      END FIGURE_MODELLO,
      CASE
        WHEN OITM."U_METAL_TIPO" = 'F' AND (
            OFAS."U_FlgAnime" <> 'N' OR OFAS."U_FlgColata" <> 'N'
          ) THEN
          CASE
            WHEN COALESCE(OMOD."U_NumFig", 1) = 0 THEN 1
            ELSE COALESCE(OMOD."U_NumFig", 1)
          END
        WHEN OITM."U_METAL_TIPO" = 'A' AND (
            OFAS."U_FlgAnime" <> 'N' OR OFAS."U_FlgColata" <> 'N'
          ) THEN
          CASE
            WHEN COALESCE(MMOD5."U_NumFig", 1) = 0 THEN 1
            ELSE COALESCE(MMOD5."U_NumFig", 1)
          END
        ELSE 1
      END FIGURE,
      OWOR."DocEntry" OWOR_DOCENTRY,
      OFAS."Code" OFAS_CODE,
      OWOR."U_METAL_MDLL" OWOR_MDLL,
      COALESCE(OLV0.OL_PROGRAMMATI, 0) OL_PROGRAMMATI
    FROM
      OWOR
      INNER JOIN RDR1 ON OWOR."Project" = RDR1."Project"
      INNER JOIN ORDR ON RDR1."DocEntry" = ORDR."DocEntry"
      INNER JOIN "@METAL_OMOD" OMOD ON OWOR."U_METAL_MDLL" = OMOD."Code"
      INNER JOIN "@METAL_OFAS" OFAS ON OWOR."U_METAL_Fase" = OFAS."Code"
      INNER JOIN "@METAL_MOD71G" M71G ON OWOR."Project" = M71G."Code" AND OWOR."ItemCode" = M71G."U_CodArt"
      INNER JOIN OITM OITM ON OWOR."ItemCode" = OITM."ItemCode"
      LEFT OUTER JOIN "@METAL_MOD5" MMOD5 on MMOD5."Code" = OWOR."U_METAL_MDLL" AND MMOD5."U_CodAnima" = OWOR."ItemCode"
      LEFT OUTER JOIN (
        SELECT
          "U_DocEntryOP" DOCENTRYOP,
          COUNT(*) OL_PROGRAMMATI
        FROM
          "@METAL_OLV0"
        WHERE
          "U_DataProgr" IS NOT NULL
        GROUP BY
          "U_DocEntryOP"
      ) OLV0 ON OWOR."DocEntry" = OLV0.DOCENTRYOP
    WHERE
      OWOR."DocNum" = ${docnum};
  `;

  return conn.exec(sql);
}
;
