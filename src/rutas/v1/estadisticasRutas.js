import express from 'express';
import { query } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import EstadisticasControlador from "../../controladores/estadisticasControlador.js";
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';

const router = express.Router();
const estadisticasControlador = new EstadisticasControlador();

const validarFechas = [
    query('fecha_desde', 'La fecha_desde es obligatoria').notEmpty(),
    query('fecha_hasta', 'La fecha_hasta es obligatoria').notEmpty(),
    validarCampos
];

/**
 * @swagger
 * /api/v1/estadisticas:
 *   get:
 *     summary: Obtener estadísticas generales de atenciones
 *     tags: [Estadísticas]
 *     parameters:
 *       - in: query
 *         name: fecha_desde
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio (YYYY-MM-DD)
 *       - in: query
 *         name: fecha_hasta
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                 estadisticas:
 *                   $ref: '#/components/schemas/EstadisticaGeneral'
 *       400:
 *         description: Faltan parámetros de fecha
 */
router.get("/", autorizarUsuarios([3]), validarFechas, estadisticasControlador.obtenerEstadisticasGenerales);

/**
 * @swagger
 * /api/v1/estadisticas/medicos:
 *   get:
 *     summary: Obtener estadísticas por médico
 *     tags: [Estadísticas]
 *     parameters:
 *       - in: query
 *         name: fecha_desde
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: fecha_hasta
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Estadísticas por médico
 */
router.get("/medicos", autorizarUsuarios([3]), validarFechas, estadisticasControlador.obtenerEstadisticasPorMedico);

/**
 * @swagger
 * /api/v1/estadisticas/obras-sociales:
 *   get:
 *     summary: Obtener estadísticas por obra social
 *     tags: [Estadísticas]
 *     parameters:
 *       - in: query
 *         name: fecha_desde
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: fecha_hasta
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Estadísticas por obra social
 */
router.get("/obras-sociales",autorizarUsuarios([3]), validarFechas, estadisticasControlador.obtenerEstadisticasPorObraSocial);

/**
 * @swagger
 * /api/v1/estadisticas/pdf:
 *   get:
 *     summary: Descargar reporte PDF de estadísticas
 *     tags: [Estadísticas]
 *     parameters:
 *       - in: query
 *         name: fecha_desde
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: fecha_hasta
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Archivo PDF generado correctamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Faltan parámetros de fecha
 *       500:
 *         description: Error al generar el PDF
 */
router.get("/pdf", autorizarUsuarios([3]), validarFechas, estadisticasControlador.generarPDF);

export { router };