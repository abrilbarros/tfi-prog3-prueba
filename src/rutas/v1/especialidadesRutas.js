import express from 'express';
import apicache from 'apicache';

import { check, param } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import EspecialidadesControlador from "../../controladores/especialidadesControlador.js";
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';

const router = express.Router();

const cache = apicache.middleware;

const especialidadesControlador = new EspecialidadesControlador();


router.get('/', autorizarUsuarios([2,3]), cache('2 minutes'), especialidadesControlador.buscarTodas);

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