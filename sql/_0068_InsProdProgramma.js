export async function _0068_InsProdProgramma (datapesa, conn) {

  // rddFase_Load
  const dt = await getDataTables(conn);

  const rddFase = [{ id: '-1', text: 'Tutte', selected: true }, ...dt.map(row => ({ id: row[0], text: row[1], Selected:false }))];

  // GetDataTable
  const unitamisuratempo = await getUnitaMisuraTempo()

  const factor = 60.0;
  if (unitamisuratempo == "O")
      factor = 60.0 * 60.0;

  const fase = '';
  // TODO: rddFase manca
  if (rddFase.SelectedValue != "-1") fase = ` AND OWOR."U_METAL_Fase" = '${rddFase.SelectedValue}' `
  const sql = `SELECT DISTINCT
    '0' || '-' || OLV0."Code" || '-' || OLV0."LineId" SKEY
    ,OWOR."DocNum"                        ORDINE_PRODUZIONE
    ,OLV0."U_DataProgr"	                    DATA
    ,CAST( OLV1.U_TMPPR         AS INT) / " + factor + @"     TEMPO_PRODUZIONE_SEC
    ,CAST( OLV1.U_TMPMD	 	    AS INT) / " + factor + @"    TEMPO_MANODOPERA_SEC
    ,CAST( OLV1.U_TMPFM		    AS INT) / " + factor + @"     TEMPO_FERMO_SEC
    ,CAST( OLV1.U_TMPAT		    AS INT) / " + factor + @"     TEMPO_ATTREZZAGGIO_SEC
    ,OLV1.U_NUMOP		                                        NUMERO_OPERATORI
    ,OLV0.U_CANCL		                                        CANCELLATO
    ,OLV0.U_CHIUSO		                                        CHIUSO
    ,CASE WHEN OFAS."U_FlgAnime" <> 'N' THEN OITM."ItemCode" || ' (Anima)' 
    ELSE COALESCE( OMOD."U_ModCode",'') END                                          	MODELLO -- 
    ,COALESCE( ORDR."CardCode",'') || ' ' || COALESCE( ORDR."CardName",'') 		CLIENTE
    ,ORDR."DocNum"    															ORDCLI
    ,ORDR."DocDate"    														ORDCLIDT
    ,CAST( OLV0."U_Quantita" AS INT ) 											QTAORD
    ,/*COALESCE(OHEM."lastName",'') || ' ' || COALESCE( OHEM."firstName",'')*/ ''      EMPLO
    ,COALESCE( OFAS."Code",'') || ' ' || COALESCE( OFAS."Name",'') 	            FASE
    ,CASE 
        WHEN COALESCE(OLV0."U_Impianto",'') = ''  THEN  '' 
        WHEN OIMP."Code" IS NULL THEN OLV0."U_Impianto" || ' Non Presente' 
        ELSE  OIMP."Code" || ' ' || COALESCE( OIMP."Name",'') 
    END	                                                                            IMPIANTO
    ,COALESCE( OMOD."U_ModCode",'') || ' ' || COALESCE( OMOD."U_DescMod",'') 	MODELLO_FULL -- 
    ,OLV0."U_PSRIG"                PESO_LORDO
    ,OLV0."U_PSMED"                PESO_MEDIO
    ,OLV1."U_Stf_BI"               STAFFE_BI
    ,OLV1."U_Stf_OK"               STAFFE_OK
    ,OITM."ItemCode" || ' ' || OITM."ItemName" ITEM
    ,COALESCE( OLV0."U_Sequenza",0)  SEQUENZA
    ,OMOD."U_CodLega"             CODICE_LEGA
    ,CAST( OMOD."U_NumFig" AS INT )              NUMERO_FIGURE
    ,MPPP."CodPlacca"                  CODICE_PLACCA
    ,MPPP."NumAnime"                   NUM_ANIME
    ,MPPP."PesoStaffa"                 PESO_STAFFA
    ,OLV1."U_QtaProd"               QUANTITA
    FROM "@METAL_OLV0" OLV0 
    INNER JOIN "@METAL_OOLV" OOLV ON OOLV."Code" = OLV0."Code"
    INNER JOIN OWOR OWOR ON OOLV."U_DocEntryOP" = OWOR."DocEntry"
    INNER JOIN OITM OITM ON OWOR."ItemCode" = OITM."ItemCode"
      LEFT OUTER JOIN "@METAL_OMOD" OMOD ON OWOR."U_METAL_MDLL" = OMOD."Code" 
      LEFT OUTER JOIN RDR1 ON OWOR."Project" = RDR1."Project"
      LEFT OUTER JOIN ORDR ON RDR1."DocEntry" = ORDR."DocEntry" 
      --LEFT OUTER JOIN OHEM ON OLV1."U_AddettoOHEM" = CAST(  OHEM."empID"  AS NVARCHAR)
    LEFT OUTER JOIN "@METAL_OFAS" OFAS 	ON OWOR."U_METAL_Fase" = OFAS."Code" 
    LEFT OUTER JOIN 
    ( 
    SELECT "Code", "U_COD0"
      ,SUM( "U_Stf_BI" ) "U_Stf_BI"
      ,SUM( "U_Stf_OK" ) "U_Stf_OK"
      ,SUM( "U_QtaProd" ) "U_QtaProd"
      ,COALESCE( SUM(CAST( U_TMPMD	 	    AS INT)),0)    U_TMPMD
      ,COALESCE( SUM(CAST( U_TMPFM		    AS INT)),0)      U_TMPFM
      ,COALESCE( SUM(CAST( U_TMPAT		    AS INT)),0)      U_TMPAT
      ,COALESCE( SUM( U_NUMOP		                   ),0)      U_NUMOP           	
      ,COALESCE( SUM(CAST( U_TMPPR		    AS INT)),0)      U_TMPPR           	
      FROM  "@METAL_OLV1" 
      WHERE "U_COD0" IS NOT NULL
      GROUP BY "Code", "U_COD0"
    ) OLV1 ON OLV0."Code" = OLV1."Code" AND OLV0."LineId" = OLV1."U_COD0" 
    LEFT OUTER JOIN "@METAL_OIMP" OIMP 	ON OLV0."U_Impianto" = OIMP."Code"
    LEFT OUTER JOIN METAL_PIANO_PRODUZIONE_PRINT MPPP ON OOLV."U_DocEntryOP" = MPPP."DocEntry" 
            AND OLV0."U_DataProgr" = MPPP."Dt_DProgr" AND OLV0."U_Sequenza" = MPPP."U_METAL_Seq"
      WHERE  OLV0."U_DataProgr" = '" + datapesa.ToString("yyyy-MM-dd") + @"' AND OLV0.U_CHIUSO = 'N' "
        + fase
        + " ORDER BY  DATA, SEQUENZA`
    return conn.exec(sql)
}