import express from 'express';
import { check, param } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import TransformarDTO from '../../middlewares/transformarDTOs.js';
import MedicosControlador from '../../controladores/medicosControlador.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';
const router = express.Router();

const medicosControlador = new MedicosControlador();
const transformarDTO = new TransformarDTO();

router.get('/', autorizarUsuarios([2,3]), medicosControlador.buscarTodos);

router.get('/:id_medico', autorizarUsuarios([2,3])
    [
        param('id_medico', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    medicosControlador.buscarPorId
);

router.post('/:id_medico/obras-sociales', autorizarUsuarios([3]),
    [
        param("id_medico")
            .notEmpty().withMessage("El id_medico es obligatorio.")
            .isInt().withMessage("El id_medico debe ser un número entero."),
        check("obras_sociales")
            .isArray().withMessage("obras_sociales debe ser un array.")
            .notEmpty().withMessage("obras_sociales no puede estar vacío."),
        check("obras_sociales.*.id_obra_social")
            .notEmpty().withMessage("Cada obra social debe tener id_obra_social.")
            .isInt().withMessage("id_obra_social debe ser un número entero."),
        validarCampos
    ],
    transformarDTO.medicosAsociarDTO,
    medicosControlador.asociarMedicoObrasSociales
);

export { router };
