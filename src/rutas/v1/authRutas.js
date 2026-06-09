import express from 'express';
import AuthController from '../../controladores/authControlador.js';

import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';

const router = express.Router();
const authController = new AuthController();

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