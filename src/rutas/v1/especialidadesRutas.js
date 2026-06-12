import express from 'express';
import apicache from 'apicache';

import { check, param } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import EspecialidadesControlador from "../../controladores/especialidadesControlador.js";
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';

const router = express.Router();

const cache = apicache.middleware;

const especialidadesControlador = new EspecialidadesControlador();

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
 *                 turnos:
 *                   type: array
 *                   items:
 *                   
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

router.get('/:id_especialidad', autorizarUsuarios([2,3]),
    [
        param('id_especialidad', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    especialidadesControlador.buscarPorId);

router.post('/',autorizarUsuarios([3]),
    [
        check('nombre')
            .notEmpty().withMessage('El nombre es obligatorio.')
            .isLength({ max: 120 }).withMessage('El nombre no debe ser mayor a 120 caracteres.'),
        validarCampos
    ],
    especialidadesControlador.crear);

router.put('/:id_especialidad', autorizarUsuarios([3]),
    [
        check('nombre')
            .notEmpty().withMessage('El nombre es obligatorio.')
            .isLength({ max: 120 }).withMessage('El nombre no debe ser mayor a 120 caracteres.'),
        param('id_especialidad', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    especialidadesControlador.modificar);

router.delete('/:id_especialidad', autorizarUsuarios([3]),
    [
        param('id_especialidad', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    especialidadesControlador.eliminar);

export { router };