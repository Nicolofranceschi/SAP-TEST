SELECT
    OWOR."DocNum" "OWOR_DOCNUM",
    OOLV."Code" || '-' || OLVX."LineId" OLV0_CODE
FROM
    "@METAL_OLV0" OLVX
    INNER JOIN "@METAL_OOLV" OOLV ON OLVX."Code" = OOLV."Code"
    INNER JOIN OWOR ON OOLV."U_DocEntryOP" = OWOR."DocEntry"
WHERE
    { splitKey [0] } || '-' || OLV0_CODE = '{key}';

oolv code - olvx lineid x -71596 -1
SELECT
    OWOR."DocNum" "OWOR_DOCNUM",
    OOLV."Code" || '-' || OLVX."LineId" OLV0_CODE
FROM
    "@METAL_OLV0" OLVX
    INNER JOIN "@METAL_OOLV" OOLV ON OLVX."Code" = OOLV."Code"
    INNER JOIN OWOR ON OOLV."U_DocEntryOP" = OWOR."DocEntry"
WHERE
    $ { splitKey0 } || '-' || OOLV."Code" || '-' || OLVX."LineId" = '${key}'









      https://192.168.30.146:50100/b1s/v1/