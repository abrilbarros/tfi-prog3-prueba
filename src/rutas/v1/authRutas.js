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
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - contrasenia
 *             properties:
 *               email: { type: string, example: ferben@correo.com }
 *               contrasenia: { type: string, format: password, example: ferben }
 *     responses:
 *       200:
 *         description: Usuario Logueado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Solicitud incorrecta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaErrorGenerico'
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaErrorInterno'
 */
router.post('/login',
    [
        check('email')
            .notEmpty().withMessage('El correo electronico es requerido!.')
            .isEmail().withMessage('Revisar el formato de correo electrónico'),
        check('contrasenia')
            .notEmpty().withMessage('La constraseña es requerida!.'),
        validarCampos
    ],
    authController.login);

export {router};