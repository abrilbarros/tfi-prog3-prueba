import express from "express";
import { param } from "express-validator";
import { validarCampos } from "../../middlewares/validarCampos.js";
import autorizarUsuarios from "../../middlewares/autorizarUsuarios.js";
import PacientesControlador from "../../controladores/pacientesControlador.js";

const router = express.Router();
const pacientesControlador = new PacientesControlador();

/**
 * @swagger
 * /api/v1/pacientes:
 *   get:
 *     summary: Listar todos los pacientes
 *     tags: [Pacientes]
 *     responses:
 *       200:
 *         description: Lista de pacientes obtenida correctamente
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
 *                     $ref: '#/components/schemas/Paciente'
 *       404:
 *         description: No se encontraron pacientes
 */
router.get('/', autorizarUsuarios([3]), pacientesControlador.buscarTodos);

/**
 * @swagger
 * /api/v1/pacientes/{id_paciente}:
 *   get:
 *     summary: Obtener un paciente por su ID
 *     tags: [Pacientes]
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
 *         description: Paciente encontrado
 *       400:
 *         description: ID invalido
 *       404:
 *         description: Paciente no encontrado
 */
router.get('/:id_paciente', autorizarUsuarios([2,3]),
    [
        param('id_paciente', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    pacientesControlador.buscarPorId
);
export { router };
