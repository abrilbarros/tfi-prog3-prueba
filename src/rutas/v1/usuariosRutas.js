import express from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import UsuariosControlador from '../../controladores/usuariosControlador.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';


const router = express.Router();

const usuariosControlador = new UsuariosControlador();

router.post('/', autorizarUsuarios([3]),
    [
        check('documento')
            .notEmpty().withMessage('El documento es obligatorio.'),

        check('apellido')
            .notEmpty().withMessage('El apellido es obligatorio.'),

        check('nombres')
            .notEmpty().withMessage('El nombre es obligatorio.'),

        check('email')
            .notEmpty().withMessage('El email es obligatorio.')
            .isEmail().withMessage('Email inválido.'),

        check('contrasenia')
            .notEmpty().withMessage('La contraseña es obligatoria.'),

        check('rol')
            .notEmpty().withMessage('El rol es obligatorio.')
            .isIn([1, 2, 3]).withMessage('Rol inválido.'),

        check('id_especialidad')
            .if((value, { req }) => req.body.rol === 1)
            .isInt( { min: 1 }).withMessage('El ID de especialidad debe ser un número entero valido.')
            .notEmpty().withMessage("La especialidad es obligatoria para medicos."),

        check('matricula')
            .if((value, { req }) => req.body.rol === 1)
            .isInt().withMessage('La matrícula debe ser un número entero.')
            .notEmpty().withMessage("La matricula es obligatoria para medicos."),

        check('descripcion')
            .if((value, { req }) => req.body.rol === 1)
            .optional(),

        check('valor_consulta')
            .if((value, { req }) => req.body.rol === 1)
            .isInt( { min: 0 }).withMessage('El valor de la consulta debe ser un número entero (0 o mayor).')
            .notEmpty().withMessage("El valor de la consulta es obligatoria para medicos."),

        check('id_obra_social')
            .if((value, { req }) => req.body.rol === 2)
            .isInt( { min: 0 }).withMessage('El ID de obra social debe ser un número entero (0 para Particular).')
            .notEmpty().withMessage("El ID de obra social es obligatoria para pacientes."),

        check('id_especialidad')
            .if((value, { req }) => req.body.rol === 3)
            .isEmpty().withMessage('Un administrador no debe tener especialidad.'),

        check('matricula')
            .if((value, { req }) => req.body.rol === 3)
            .isEmpty().withMessage('Un administrador no debe tener matrícula.'),

        check('valor_consulta')
            .if((value, { req }) => req.body.rol === 3)
            .isEmpty().withMessage('Un administrador no debe tener valor de consulta.'),

        check('id_obra_social')
            .if((value, { req }) => req.body.rol === 3)
            .isEmpty().withMessage('Un administrador no debe tener obra social.'),

        validarCampos
    ],
    usuariosControlador.crear
);

export { router };