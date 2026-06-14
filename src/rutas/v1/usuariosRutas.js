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
 *     summary: Listar todas los administradores
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de Admins obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/RespuestaListaAdmins'               
 *       404:
 *         description: No se encontraron Administradores
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
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/CrearUsuario'
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaCreacionUsuario'
 *       400:
 *         description: Error de validación, el usuario ya existe
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


/**
 * @swagger
 * /api/v1/usuarios/{id_usuario}:
 *   put:
 *     summary: Modificar un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del usuario
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/ModificarUsuario'
 *     responses:
 *       200:
 *         description: Usuario modificado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaModificacion'
 *       400:
 *         description: No se enviaron datos para actualizar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaErrorGenerico'
 *       404:
 *         description: Usuario Inexistente
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
router.put('/:id_usuario', autorizarUsuarios([3]),
    [
        param('id_usuario').notEmpty().withMessage('El Id usuario es obligatorio.')
            .isInt().withMessage('El Id debe ser un numero entero'),
        check('email')
            .optional({ checkFalsy: true })
            .isEmail().withMessage('Email invalido!.'),
        check('descripcion').optional(),
        
        check('valor_consulta').optional(),

        check('id_especialidad').optional(),
        
        check('id_obra_social').optional(),
        
        validarCampos
    ],
    transformarDTO.usuariosModificarDTO,
    usuariosControlador.modificar
);

/**
 * @swagger
 * /api/v1/usuarios/{id_usuario}:
 *   delete:
 *     summary: Eliminar (soft delete)
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del usuario
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuario eliminado con exito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaEliminacion'
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
router.delete('/:id_usuario', autorizarUsuarios([3]),
    [
        param('id_usuario', 'El parámetro debe ser entero').isInt(),    
        validarCampos
    ],
    usuariosControlador.eliminar
);

export { router };