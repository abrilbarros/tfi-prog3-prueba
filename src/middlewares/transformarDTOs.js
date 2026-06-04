export default class TransformarDTO {
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
}