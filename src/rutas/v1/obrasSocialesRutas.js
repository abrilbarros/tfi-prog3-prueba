import express from 'express';
import apicache from 'apicache';

import { check, param } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';

import TransformarDTO from '../../middlewares/transformarDTOs.js';
import ObrasSocialesControlador from '../../controladores/obrasSocialesControlador.js';

const router = express.Router();

const cache = apicache.middleware;

const obrasSocialesControlador = new ObrasSocialesControlador();
const transformarDTO = new TransformarDTO();

/**
 * @swagger
 * /api/v1/obras-sociales:
 *   get:
 *     summary: Listar todas las obras sociales
 *     tags: [Obras Sociales]
 *     responses:
 *       200:
 *         description: Lista de obras sociales obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 datos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ObraSocial'
 *       500:
 *         description: Error interno
 */
router.get('/', autorizarUsuarios([3]), cache('2 minutes'), obrasSocialesControlador.buscarTodas);

/**
 * @swagger
 * /api/v1/obras-sociales/{id_obra_social}:
 *   get:
 *     summary: Obtener una obra social por su ID
 *     tags: [Obras Sociales]
 *     parameters:
 *       - in: path
 *         name: id_obra_social
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la obra social
 *         example: 2
 *     responses:
 *       200:
 *         description: Obra Social encontrada
 *       400:
 *         description: ID invalido
 *       404:
 *         description: Obra Social no encontrada
 *       500:
 *         description: Error interno
 */
router.get('/:id_obra_social', autorizarUsuarios([3]), cache('2 minutes'),
    [
        param('id_obra_social', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    obrasSocialesControlador.buscarPorId
);

/**
 * @swagger
 * /api/v1/obras-sociales:
 *   post:
 *     summary: Crear una nueva obra social
 *     tags: [Obras Sociales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - descripcion
 *               - porcentaje_descuento
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "IOSFA"
 *               descripcion:
 *                 type: string
 *                 example: "Cobertura para fuerzas armadas y de seguridad"
 *               porcentaje_descuento:
 *                 type: number
 *                 example: 30
 *     responses:
 *       201:
 *         description: Obra Social creada
 *       400:
 *         description: Error en los datos o no se pudo crear la obra social
 *       409:
 *         description: Ya existe una obra social con ese nombre
 *       500:
 *         description: Error interno
 */
router.post('/', autorizarUsuarios([3]),
    [
        check('nombre')
            .notEmpty().withMessage('El nombre es obligatorio.')
            .isString().withMessage('El nombre debe ser cadena de caracteres.')
            .isLength({ max: 120 }).withMessage('El nombre no debe ser mayor a 120 caracteres.'),
        check('descripcion')
            .notEmpty().withMessage('La descripción es obligatoria.')
            .isString().withMessage('La descripción debe ser cadena de caracteres.')
            .isLength({ max: 120 }).withMessage('La descripción no debe ser mayor a 120 caracteres.'),
        check('porcentaje_descuento')
            .notEmpty().withMessage('El porcentaje_descuento es obligatorio.'),
        validarCampos
    ],
    transformarDTO.obrasSocialesCrearDTO,
    obrasSocialesControlador.crear);

/**
 * @swagger
 * /api/v1/obras-sociales/{id_obra_social}:
 *   put:
 *     summary: Modificar una obra social
 *     tags: [Obras Sociales]
 *     parameters:
 *       - in: path
 *         name: id_obra_social
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la obra social
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "OSUNER"
 *               descripcion:
 *                 type: string
 *                 example: "Obra social de la universidad"
 *               porcentaje_descuento:
 *                 type: number
 *                 example: 45
 *     responses:
 *       200:
 *         description: Obra Social modificada
 *       400:
 *         description: ID invalido o error en los datos
 *       403:
 *         description: La primera obra social no se puede modificar
 *       404:
 *         description: Obra Social no encontrada
 *       409:
 *         description: Ya existe una obra social con ese nombre
 *       500:
 *         description: Error interno
 */
router.put('/:id_obra_social', autorizarUsuarios([3]),
    [
        param('id_obra_social', 'El parámetro debe ser entero').isInt(),
        check('nombre')
            .optional()
            .notEmpty().withMessage('El nombre no puede estar vacío.')
            .isString().withMessage('El nombre debe ser cadena de caracteres.')
            .isLength({ max: 120 }).withMessage('El nombre no debe ser mayor a 120 caracteres.'),
        check('descripcion')
            .optional()
            .notEmpty().withMessage('La descripción no puede estar vacía.')
            .isString().withMessage('La descripción debe ser cádena de caracteres.')
            .isLength({ max: 120 }).withMessage('La descripción no debe ser mayor a 120 caracteres.'),
        check('porcentaje_descuento')
            .optional()
            .isNumeric().withMessage('El porcentaje_descuento debe ser numérico.'),
        validarCampos
    ],
    transformarDTO.obrasSocialesActualizarDTO,
    obrasSocialesControlador.modificar);

/**
 * @swagger
 * /api/v1/obras-sociales/{id_obra_social}:
 *   delete:
 *     summary: Eliminar una obra social (soft delete)
 *     tags: [Obras Sociales]
 *     parameters:
 *       - in: path
 *         name: id_obra_social
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la obra social
 *         example: 2
 *     responses:
 *       200:
 *         description: Obra Social eliminada correctamente
 *       400:
 *         description: ID invalido
 *       403:
 *         description: La primera obra social no se puede eliminar
 *       404:
 *         description: Obra Social no encontrada
 *       500:
 *         description: Error interno
 */
router.delete('/:id_obra_social', autorizarUsuarios([3]),
    [
        param('id_obra_social', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    obrasSocialesControlador.eliminar);

export { router };
