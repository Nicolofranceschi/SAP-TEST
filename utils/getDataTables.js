export default function getDataTables (conn) {
  const query = `SELECT "Code", "Code" || '-' || "Name"  FROM "@METAL_OFAS"  ORDER BY "Code" || '-' || "Name" `;
  return conn.sql(query); ;
}