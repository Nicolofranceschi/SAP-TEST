import express from 'express';
import hana from '@sap/hana-client';
import * as config from './utiles/app.js';
import { _1068_SelezioneRiga } from './sql/_1068_SelezioneRiga.js';
import { _1002_GetDataDaOrdinediProduzione } from './sql/_1002_GetDataDaOrdinediProduzione.js';
import { _0071_DettaglioModello } from './sql/_0071_DettaglioModello.js';

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const app = express();
const conn = hana.createConnection();

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

try {
  // SQL connection
  await conn.connect(sqlParams);

  // imposto lo schema al database
  await conn.exec(`SET SCHEMA ${schema};`);
  
  await config.serviceLayerLogin(JSON.stringify(serviceLayerParams));

  const key = "72347-83845-1"; 
  const result_1068 = await _1068_SelezioneRiga(key,conn);
  const OWOR_DOCNUM = result_1068[0].OWOR_DOCNUM;
   console.log(result_1068);

  const result_1002 = await _1002_GetDataDaOrdinediProduzione(OWOR_DOCNUM,conn);
   console.log(result_1002);

  const result_0071 = await _0071_DettaglioModello(OWOR_DOCNUM,conn);
  console.log(result_0071);

  //await config.serviceLayerLogout()
  conn.disconnect();
} catch (e) { console.error(e); }



app.listen(5000, () => console.log('\n\nRunning'));
