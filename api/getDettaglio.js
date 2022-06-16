import express from 'express'
import { _0071_DettaglioModello } from '../sql/_0071_DettaglioModello.js';
import { _1002_GetDataDaOrdinediProduzione } from '../sql/_1002_GetDataDaOrdinediProduzione.js';
import { _1068_SelezioneRiga } from '../sql/_1068_SelezioneRiga.js';
import { conn } from './../index.js'


const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const result_1068 = await _1068_SelezioneRiga(req.body.key, conn);
        const OWOR_DOCNUM = result_1068[0].OWOR_DOCNUM;

        // const result_1002 = await _1002_GetDataDaOrdinediProduzione(OWOR_DOCNUM, conn);
        const result_0071 = await _0071_DettaglioModello(OWOR_DOCNUM, conn);
        res.json(result_0071)
    } catch (error) {
        console.log(error)
        res.send(error.message);
    }
});

export default router;