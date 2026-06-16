import crypto from 'crypto'

export default class TransformarDTO {
    especialidadesCrearDTO = async (req, res, next) => {
        const { nombre } = req.body;

        req.dto = {
            nombre: nombre.trim().toUpperCase()
        };

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
        const { nombre, descripcion, porcentaje_descuento } = req.body;

        req.dto = {
            nombre: nombre.trim().toUpperCase(),
            descripcion: descripcion.trim(),
            porcentaje_descuento,
            es_particular: 0
        };

        next();
    }

    obrasSocialesActualizarDTO = async (req, res, next) => {
        const { id_obra_social } = req.params;
        const { nombre, descripcion, porcentaje_descuento } = req.body;

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

        req.dto = dto;

        next();
    }

    medicosAsociarDTO = async (req, res, next) => {
        const { id_medico } = req.params;
        const { obras_sociales } = req.body;
        const idsVistos = new Set();
        const obrasSocialesSinRepetir = [];
        const obrasSocialesRepetidas = [];

        for (const obra_social of obras_sociales) {
            const idObraSocial = Number(obra_social.id_obra_social);

            if (idsVistos.has(idObraSocial)) {
                obrasSocialesRepetidas.push(idObraSocial);
                continue;
            }

            idsVistos.add(idObraSocial);
            obrasSocialesSinRepetir.push({ id_obra_social: idObraSocial });
        }

        req.dto = {
            id_medico: Number(id_medico),
            obras_sociales: obrasSocialesSinRepetir,
            obras_sociales_repetidas: obrasSocialesRepetidas
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
