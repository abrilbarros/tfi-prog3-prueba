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
 *     tags: [Auth]
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

/**
 * @swagger
 * /api/v1/auth/olvidoContrasenia:
 *   post:
 *     summary: Generar token para reinicio de contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: 'string'
 *                 format: 'email'
 *                 example: email@correo.com
 *     responses:
 *       200:
 *         description: Token generado con exito
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
 *                   example: Token generado con exito
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       404:
 *         description: Usuario no encontrado
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
router.post('/olvidoContrasenia',
    [
        check('email')
            .notEmpty().withMessage('El email es obligatorio.')
            .isEmail().withMessage('Email inválido.'),
        validarCampos
    ],
    authController.buscarPorEmail
)

/**
 * @swagger
 * /api/v1/auth/reinicioContrasenia:
 *   put:
 *     summary: Reiniciar Contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/ReiniciarContrasenia'
 *     responses:
 *       200:
 *         description: Contraseña modificada con exito
 *         content:
 *           application/json:
 *             schema:
*               $ref: '#/components/schemas/RespuestaCambioContrasenia'
 *       401:
 *         description: Token inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaErrorGenerico'
 *       404:
 *         description: El usuario no existe
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
router.put('/reinicioContrasenia',
    [
        check('token').notEmpty().withMessage('El Token es obligatorio'),
        check('documento').notEmpty().withMessage('El documento es obligatorio'),
        check('nuevaContrasenia').notEmpty().withMessage('La contraseña es obligatoria'),
        check('repetirContrasenia').notEmpty().withMessage('Repetir la contraseña es obligatorio'),
        validarCampos
    ],
    authController.reinicioContrasenia
)

export {router};