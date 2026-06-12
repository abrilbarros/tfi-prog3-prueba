import express from 'express';
import { check, param } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import UsuariosControlador from '../../controladores/usuariosControlador.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';
import TransformarDTO from '../../middlewares/transformarDTOs.js';


const router = express.Router();

const usuariosControlador = new UsuariosControlador();
const transformarDTO = new TransformarDTO();

/**
 * @swagger
 * /api/v1/usuarios/admins:
 *   get:
 *     summary: Listar todas las especialidades
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de Admins obtenida correctamente
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
 *         description: No se encontraron Administradores
 */
router.get('/admins', autorizarUsuarios([3]), usuariosControlador.listarAdmins);

/**
 * @swagger
 * /api/v1/usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearUsuario'
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Error en los datos
 *       500:
 *         description: Error interno
 */
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
            .isInt( { min: 0 }).withMessage('El ID de obra social debe ser un número entero (1 para Particular).')
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
    transformarDTO.usuariosCrearDTO,
    usuariosControlador.crear
);

router.put('/:id_usuario', autorizarUsuarios([3]),
    [
        param('id_usuario').notEmpty().withMessage('El Id usuario es obligatorio.')
            .isInt().withMessage('El Id debe ser un numero entero'),
        check('email').isEmail().withMessage('Email invalido!.')
            .optional(),
        check('descripcion').optional(),
        
        check('valor_consulta').optional(),

        check('id_especialidad').optional(),
        
        check('id_obra_social').optional(),
        
        validarCampos
    ],
    transformarDTO.usuariosModificarDTO,
    usuariosControlador.modificar
);

router.delete('/:id_usuario', autorizarUsuarios([3]),
    [
        param('id_usuario', 'El parámetro debe ser entero').isInt(),    
        validarCampos
    ],
    usuariosControlador.eliminar
);

export { router };