import express from 'express';
import { check, param } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import TransformarDTO from '../../middlewares/transformarDTOs.js';
import MedicosControlador from '../../controladores/medicosControlador.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';
const router = express.Router();

const medicosControlador = new MedicosControlador();
const transformarDTO = new TransformarDTO();

/**
 * @swagger
 * /api/v1/medicos:
 *   get:
 *     summary: Listar todos los medicos
 *     tags: [Medicos]
 *     responses:
 *       200:
 *         description: Lista de medicos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Medicos encontrados."
 *                 datos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Medico'
 *       404:
 *         description: No se encontraron medicos
 */
router.get('/', autorizarUsuarios([2,3]), medicosControlador.buscarTodos);

/**
 * @swagger
 * /api/v1/medicos/{id_medico}:
 *   get:
 *     summary: Obtener un medico por su ID
 *     tags: [Medicos]
 *     parameters:
 *       - in: path
 *         name: id_medico
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del medico
 *         example: 1
 *     responses:
 *       200:
 *         description: Medico encontrado
 *       400:
 *         description: ID invalido
 *       404:
 *         description: Medico no encontrado
 */
router.get('/:id_medico', autorizarUsuarios([2,3]),
    [
        param('id_medico', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    medicosControlador.buscarPorId
);

/**
 * @swagger
 * /api/v1/medicos/{id_medico}/obras-sociales:
 *   post:
 *     summary: Asociar un medico con obras sociales
 *     tags: [Medicos]
 *     parameters:
 *       - in: path
 *         name: id_medico
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del medico
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - obras_sociales
 *             properties:
 *               obras_sociales:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - id_obra_social
 *                   properties:
 *                     id_obra_social:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Medico y obras sociales relacionadas
 *       400:
 *         description: Error en los datos o no se crearon las relaciones
 *       404:
 *         description: Medico u obra social no encontrada
 *       409:
 *         description: Las relaciones ya existian
 *       500:
 *         description: Error interno
 */
router.post('/:id_medico/obras-sociales', autorizarUsuarios([3]),
    [
        param("id_medico")
            .notEmpty().withMessage("El id_medico es obligatorio.")
            .isInt().withMessage("El id_medico debe ser un número entero."),
        check("obras_sociales")
            .isArray().withMessage("obras_sociales debe ser un array.")
            .notEmpty().withMessage("obras_sociales no puede estar vacío."),
        check("obras_sociales.*.id_obra_social")
            .notEmpty().withMessage("Cada obra social debe tener id_obra_social.")
            .isInt().withMessage("id_obra_social debe ser un número entero."),
        validarCampos
    ],
    transformarDTO.medicosAsociarDTO,
    medicosControlador.asociarMedicoObrasSociales
);

export { router };
