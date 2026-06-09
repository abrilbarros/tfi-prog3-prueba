import express from 'express';
import { query } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import EstadisticasControlador from "../../controladores/estadisticasControlador.js";

const router = express.Router();
const estadisticasControlador = new EstadisticasControlador();

const validarFechas = [
    query('fecha_desde', 'La fecha_desde es obligatoria').notEmpty(),
    query('fecha_hasta', 'La fecha_hasta es obligatoria').notEmpty(),
    validarCampos
];


router.get('/', validarFechas, estadisticasControlador.obtenerEstadisticasGenerales);
router.get('/medicos', validarFechas, estadisticasControlador.obtenerEstadisticasPorMedico);
router.get('/obras-sociales', validarFechas, estadisticasControlador.obtenerEstadisticasPorObraSocial);
router.get('/pdf', validarFechas, estadisticasControlador.generarPDF);

export { router };