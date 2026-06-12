import express from 'express';
import AuthController from '../../controladores/authControlador.js';

import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';

const router = express.Router();
const authController = new AuthController();

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Logear usuario
 *     tags: [auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - contrasenia
 *             properties:
 *               email: { type: string }
 *               contrasenia: { type: string, format: password }
 *     responses:
 *       200:
 *         description: Usuario Logueado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *       400:
 *         description: Error en los datos
 *       500:
 *         description: Error interno
 */
router.post('/login',
    [
        check('email')
            .notEmpty().withMessage('El correo electronico es requerido!.')
            .isEmail().withMessage('Revisar el formato dle correo electrónico'),
        check('contrasenia')
            .notEmpty().withMessage('La constraseña es requerida!.'),
        validarCampos
    ],
    authController.login);

export {router};