import express from 'express';
import { Controller } from '../controller/controller';

var router = express.Router();
var controller = new Controller();

router.get('/getKey/:key', controller.getKey );
router.get('/getKeyOptInCache/:key', controller.getKeyOptInCache );
router.post('/addKey', controller.addOrUpdateKey);
router.delete('/deleteKey/:key', controller.deleteKey);

export default {router};