export default function getUnitaMisuraTempo () {
  const sql = 'SELECT TOP 1 "U_UmTempi" FROM "@METAL_OPGE"';
  return (await conn.exec(sql))[0].U_UmTempi.trim().toUpperCase();
}