import express from 'express';
import { check, param } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import TurnosControlador from "../../controladores/turnosReservasControlador.js";
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';

const router = express.Router();
const turnosControlador = new TurnosControlador();

/**
 * @swagger
 * /api/v1/turnosReservas:
 *   get:
 *     summary: Listar todos los turnos
 *     tags: [Turnos]
 *     responses:
 *       200:
 *         description: Lista de turnos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 turnos:
 *                   type: array
 *                   items:
 *                      $ref: '#/components/schemas/Turno'
 *                     
 *       404:
 *         description: No se encontraron turnos
 */
router.get('/',autorizarUsuarios([3]), turnosControlador.buscarTodas);

/**
 * @swagger
 * /api/v1/turnos/{id_turno}:
 *   get:
 *     summary: Obtener un turno por su ID
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id_turno
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del turno
 *         example: 1
 *     responses:
 *       200:
 *         description: Turno encontrado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Turno no encontrado
 */
router.get('/:id_turno', autorizarUsuarios([3]),
    [param('id_turno').isInt().withMessage('El ID debe ser un número entero'), validarCampos],
    turnosControlador.buscarPorId
);

/**
 * @swagger
 * /api/v1/turnos/medico/{id_medico}:
 *   get:
 *     summary: Obtener turnos de un médico específico
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id_medico
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del médico
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de turnos del médico
 *       400:
 *         description: ID inválido
 */
router.get('/medico/:id_medico', autorizarUsuarios([1]),
    [param('id_medico').isInt().withMessage('El ID debe ser un número entero'), validarCampos],
    turnosControlador.buscarPorMedico
);

/**
 * @swagger
 * /api/v1/turnos/paciente/{id_paciente}:
 *   get:
 *     summary: Obtener turnos de un paciente específico
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id_paciente
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del paciente
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de turnos del paciente
 *       400:
 *         description: ID inválido
 */
router.get('/paciente/:id_paciente', autorizarUsuarios([2]),
    [param('id_paciente').isInt().withMessage('El ID debe ser un número entero'), validarCampos],
    turnosControlador.buscarPorPaciente
);

/**
 * @swagger
 * /api/v1/turnos:
 *   post:
 *     summary: Crear un nuevo turno
 *     tags: [Turnos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_medico
 *               - id_paciente
 *               - id_obra_social
 *               - fecha_hora
 *             properties:
 *               id_medico:
 *                 type: integer
 *                 example: 3
 *               id_paciente:
 *                 type: integer
 *                 example: 2
 *               id_obra_social:
 *                 type: integer
 *                 example: 2
 *               fecha_hora:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-12-25 15:30:00"
 *     responses:
 *       201:
 *         description: Turno creado correctamente
 *       400:
 *         description: Error en los datos o médico no disponible
 *       500:
 *         description: Error interno
 */
router.post('/', autorizarUsuarios([2,3]),
    [
        check('id_medico', 'El ID del médico es obligatorio').isInt(),
        check('id_paciente', 'El ID del paciente es obligatorio').isInt(),
        check('id_obra_social', 'El ID de la obra social es obligatorio').isInt(),
        check('fecha_hora', 'La fecha y hora es obligatoria').notEmpty(),
        validarCampos
    ],
    turnosControlador.crear
);

/**
 * @swagger
 * /api/v1/turnos/{id_turno}/marcar-atendido:
 *   put:
 *     summary: Marcar un turno como atendido
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id_turno
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del turno
 *         example: 1
 *     responses:
 *       200:
 *         description: Turno marcado como atendido
 *       400:
 *         description: ID inválido o turno ya atendido
 *       404:
 *         description: Turno no encontrado
 */
router.put('/:id_turno/marcar-atendido', autorizarUsuarios([1]),
    [param('id_turno').isInt().withMessage('El ID debe ser un número entero'), validarCampos],
    turnosControlador.marcarAtendido
);

/**
 * @swagger
 * /api/v1/turnos/{id_turno}:
 *   delete:
 *     summary: Cancelar un turno (soft delete)
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id_turno
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del turno
 *         example: 1
 *     responses:
 *       200:
 *         description: Turno cancelado correctamente
 *       400:
 *         description: ID inválido o turno ya atendido
 *       404:
 *         description: Turno no encontrado
 */
router.delete('/:id_turno', autorizarUsuarios([3]),
    [param('id_turno').isInt().withMessage('El ID debe ser un número entero'), validarCampos],
    turnosControlador.cancelar
);

export { router };