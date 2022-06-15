import express from 'express'
import { conn } from './../index.js'
import { list } from '../sql/list.js';
import { _0068_InsProdProgramma } from '../sql/_0068_InsProdProgramma.js';

const router = express.Router();

router.post('/',async (req, res) => { 
    try {
        const result = await list(conn)
        res.json(result)
    } catch (error) {
        res.send(error.message); 
    }
});

export default router;

