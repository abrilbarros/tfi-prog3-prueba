import express from 'express';
import apicache from 'apicache';

import { check, param } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import EspecialidadesControlador from "../../controladores/especialidadesControlador.js";
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';
import TransformarDTO from '../../middlewares/transformarDTOs.js';

const router = express.Router();

const cache = apicache.middleware;

const especialidadesControlador = new EspecialidadesControlador();
const transformarDTO = new TransformarDTO();

/**
 * @swagger
 * /api/v1/especialidades:
 *   get:
 *     summary: Listar todas las especialidades
 *     tags: [Especialidades]
 *     responses:
 *       200:
 *         description: Lista de especialidades obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 especialidades:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Especialidad'
 *       404:
 *         description: No se encontraron Especialidades
 */
router.get('/', autorizarUsuarios([2,3]),
    (req, res, next) => {
        // Esto te mostrará quién está intentando entrar y qué rol tiene
        console.log("--- DEBUG RUTA TURNOS ---");
        console.log("Usuario en req:", req.user);
        console.log("Rol del usuario:", req.user?.rol);
        console.log("Tipo de dato del rol:", typeof req.user?.rol);
        next(); // ¡IMPORTANTE! Esto le dice a Express que continúe al siguiente middleware
    },
    cache('2 minutes'), especialidadesControlador.buscarTodas);

/**
 * @swagger
 * /api/v1/especialidades/{id_especialidad}:
 *   get:
 *     summary: Obtener una especialidad por su ID
 *     tags: [Especialidades]
 *     parameters:
 *       - in: path
 *         name: id_especialidad
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la especialidad
 *         example: 1
 *     responses:
 *       200:
 *         description: Especialidad encontrada
 *       400:
 *         description: ID invalido
 *       404:
 *         description: Especialidad no encontrada
 */
router.get('/:id_especialidad', autorizarUsuarios([2,3]),
    [
        param('id_especialidad', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    especialidadesControlador.buscarPorId);

/**
 * @swagger
 * /api/v1/especialidades:
 *   post:
 *     summary: Crear una nueva especialidad
 *     tags: [Especialidades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "CARDIOLOGIA"
 *     responses:
 *       201:
 *         description: Especialidad creada correctamente
 *       400:
 *         description: Error en los datos
 *       409:
 *         description: Ya existe una especialidad con ese nombre
 *       500:
 *         description: Error interno
 */
router.post('/',autorizarUsuarios([3]),
    [
        check('nombre')
            .notEmpty().withMessage('El nombre es obligatorio.')
            .isString().withMessage('El nombre debe ser cadena de caracteres.')
            .isLength({ max: 120 }).withMessage('El nombre no debe ser mayor a 120 caracteres.'),
        validarCampos
    ],
    transformarDTO.especialidadesCrearDTO,
    especialidadesControlador.crear);

/**
 * @swagger
 * /api/v1/especialidades/{id_especialidad}:
 *   put:
 *     summary: Modificar una especialidad
 *     tags: [Especialidades]
 *     parameters:
 *       - in: path
 *         name: id_especialidad
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la especialidad
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "TRAUMATOLOGIA"
 *     responses:
 *       200:
 *         description: Especialidad modificada
 *       400:
 *         description: ID invalido o error en los datos
 *       404:
 *         description: Especialidad no encontrada
 *       409:
 *         description: Ya existe una especialidad con ese nombre
 *       500:
 *         description: Error interno
 */
router.put('/:id_especialidad', autorizarUsuarios([3]),
    [
        check('nombre')
            .optional()
            .notEmpty().withMessage('El nombre no puede estar vacío.')
            .isString().withMessage('El nombre debe ser cadena de caracteres.')
            .isLength({ max: 120 }).withMessage('El nombre no debe ser mayor a 120 caracteres.'),
        param('id_especialidad', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    transformarDTO.especialidadesActualizarDTO,
    especialidadesControlador.modificar);

/**
 * @swagger
 * /api/v1/especialidades/{id_especialidad}:
 *   delete:
 *     summary: Eliminar una especialidad (soft delete)
 *     tags: [Especialidades]
 *     parameters:
 *       - in: path
 *         name: id_especialidad
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la especialidad
 *         example: 1
 *     responses:
 *       200:
 *         description: Especialidad eliminada correctamente
 *       400:
 *         description: ID invalido
 *       404:
 *         description: Especialidad no encontrada
 *       500:
 *         description: Error interno
 */
router.delete('/:id_especialidad', autorizarUsuarios([3]),
    [
        param('id_especialidad', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    especialidadesControlador.eliminar);

export { router };
