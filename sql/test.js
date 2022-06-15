export function fase(conn) {
    const sql = `SELECT"Code","Code"||'-'||"Name"FROM"@METAL_OFAS"ORDERBY"Code"||'-'||"Name"`;
    return conn.exec(sql);
}

export function getUnitadimisura(conn) {
    const sql = `SELECT "U_UmTempi" FROM "@METAL_OPGE"`;
    return conn.exec(sql);
}

