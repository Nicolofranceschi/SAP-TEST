export function _1068_SelezioneRiga(key,conn) {
    const splitKey0 = key.split('-')[0];
    const sql = `
      SELECT
        OWOR."DocNum" "OWOR_DOCNUM",
        OOLV."Code" || '-' || OLVX."LineId" OLV0_CODE
      FROM
        "@METAL_OLV0" OLVX
        INNER JOIN "@METAL_OOLV" OOLV ON OLVX."Code" = OOLV."Code"
        INNER JOIN OWOR ON OOLV."U_DocEntryOP" = OWOR."DocEntry"
      WHERE
        ${splitKey0} || '-' || OOLV."Code" || '-' || OLVX."LineId" = '${key}';
    `;
  
    return conn.exec(sql);
  }