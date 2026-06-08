import express from 'express';
import { check, param } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import TurnosControlador from "../../controladores/turnosControlador.js";

const router = express.Router();
const turnosControlador = new TurnosControlador();

router.get('/', turnosControlador.buscarTodas);

router.get('/:id_turno',
    [
        param('id_turno', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    turnosControlador.buscarPorId
);

router.get('/medico/:id_medico',
    [
        param('id_medico', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    turnosControlador.buscarPorMedico
);

router.get('/paciente/:id_paciente',
    [
        param('id_paciente', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    turnosControlador.buscarPorPaciente
);

router.post('/',
    [
        check('id_medico', 'El ID del médico es obligatorio').isInt(),
        check('id_paciente', 'El ID del paciente es obligatorio').isInt(),
        check('id_obra_social', 'El ID de la obra social es obligatorio').isInt(),
        check('fecha_hora', 'La fecha y hora es obligatoria').notEmpty(),
        validarCampos
    ],
    turnosControlador.crear
);

router.put('/:id_turno/marcar-atendido',
    [
        param('id_turno', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    turnosControlador.marcarAtendido
);

router.delete('/:id_turno',
    [
        param('id_turno', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    turnosControlador.cancelar
);

export { router };