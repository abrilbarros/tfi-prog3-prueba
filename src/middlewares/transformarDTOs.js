import crypto from 'crypto'
import EspecialidadesCrearDTO from '../dtos/especialidadesCrearDTO.js';

export default class TransformarDTO {
    especialidadesCrearDTO = async (req, res, next) => {
        req.dto = new EspecialidadesCrearDTO(req.body);

        next();
    }

    especialidadesActualizarDTO = async (req, res, next) => {
        const { id_especialidad } = req.params;
        const { nombre } = req.body;

        const dto = {
            id_especialidad: parseInt(id_especialidad)
        };

        if (nombre !== undefined) {
            dto.nombre = nombre.trim().toUpperCase();
        }

        req.dto = dto;

        next();
    }

    obrasSocialesCrearDTO = async (req, res, next) => {
        const { nombre, descripcion, porcentaje_descuento, es_particular } = req.body;

        req.dto = {
            nombre: nombre.trim().toUpperCase(),
            descripcion: descripcion.trim(),
            porcentaje_descuento,
            es_particular
        };

        next();
    }

    obrasSocialesActualizarDTO = async (req, res, next) => {
        const { id_obra_social } = req.params;
        const { nombre, descripcion, porcentaje_descuento, es_particular } = req.body;

        const dto = {
            id_obra_social: parseInt(id_obra_social)
        };

        if (nombre !== undefined) dto.nombre = nombre.trim().toUpperCase();

        if (descripcion !== undefined) {
            dto.descripcion = descripcion.trim();
        }

        if (porcentaje_descuento !== undefined) {
            dto.porcentaje_descuento = porcentaje_descuento;
        }

        if (es_particular !== undefined) {
            dto.es_particular = es_particular;
        }

        req.dto = dto;

        next();
    }

    medicosAsociarDTO = async (req, res, next) => {
        const { id_medico } = req.params;
        const { obras_sociales } = req.body;

        req.dto = {
            id_medico: Number(id_medico),
            obras_sociales: obras_sociales.map(obra_social => ({
                id_obra_social: Number(obra_social.id_obra_social)
            }))
        };

        next();
    }

    usuariosCrearDTO = async (req, res, next) => {
        const { documento, apellido, nombres, email, contrasenia, rol, id_especialidad, matricula, descripcion, valor_consulta, id_obra_social} = req.body;

        req.dto = {
            documento : parseInt(documento),
            apellido : apellido.trim(),
            nombres : nombres.trim(),
            email : email.trim().toLowerCase(),
            contrasenia : crypto.createHash('sha256').update(contrasenia).digest('hex'),
            rol : parseInt(rol),

            //Datos de medico
            id_especialidad : id_especialidad ? parseInt(id_especialidad) : null,
            matricula : matricula ? parseInt(matricula) : null,
            descripcion : descripcion ? descripcion.trim() : null,
            valor_consulta : valor_consulta ? parseInt(valor_consulta) : null,

            //Datos de Paciente

            id_obra_social : id_obra_social ? parseInt(id_obra_social) : null
        }

        next();
    }

    usuariosModificarDTO = async(req, res, next) => {
        const { email, descripcion, valor_consulta, id_especialidad, id_obra_social} = req.body;

        req.dto = {
            email: email ? email.trim().toLowerCase() : null,

            descripcion : descripcion ? descripcion.trim() : null,
            valor_consulta : valor_consulta ? parseInt(valor_consulta) : null,
            id_especialidad : id_especialidad ? parseInt(id_especialidad) : null,
            
            id_obra_social : id_obra_social ? parseInt(id_obra_social) : null
        }

        next()
    };

    CambiarContraseniaDTO = async(req, res, next) => {
        const { contraseniaActual, nuevaContrasenia, repetirContrasenia} = req.body;

        req.dto = {
            contraseniaActual : contraseniaActual.trim(),
            nuevaContrasenia : nuevaContrasenia.trim(),
            repetirContrasenia : repetirContrasenia.trim()
        }

        next()
    }
}
