
import express from 'express';
import getList from "./api/getList.js";
import getDettaglio from "./api/getDettaglio.js";
import hana from '@sap/hana-client';
import * as config from './utiles/app.js';

export const app = express();

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

export const conn = hana.createConnection();

const schema = "TAZZARI_020322"; 
const sqlURL = "192.168.30.146:30015";
const sqlParams = {
  serverNode: sqlURL,
  UID: "SYSB1",
  PWD: "Passw0rd",
  sslValidateCertificate: "false",
};


const serviceLayerParams = {
  "UserName": "manager",
  "Password": "password",
  "CompanyDB": schema
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use("/list", getList);
app.use("/dettaglio", getDettaglio);

await conn.connect(sqlParams);

await conn.exec(`SET SCHEMA ${schema};`);

await config.serviceLayerLogin(JSON.stringify(serviceLayerParams));

const server = app.listen(5000, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})