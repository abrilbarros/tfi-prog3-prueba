import Medicos from "../db/medicos.js"
import MedicosRespuestaDTO from "../dtos/medicosRespuestaDTO.js";

export default class MedicosServicio {

    constructor() {
        this.medicos = new Medicos();
    }

    buscarPorId = (id_medico) => {
        return this.medicos.buscarPorId(id_medico);
    }

    buscarTodos = async () => {
        const datos = await this.medicos.buscarTodos();
        // uso el DTO de respuesta           
        return datos.map(medico => new MedicosRespuestaDTO(medico));
    }

    asociarMedicoObrasSociales = async (id_medico, obras_sociales, obras_sociales_repetidas = []) => {
        const relacion = await this.medicos.relacionarConObraSocial(id_medico, obras_sociales);

        if (relacion && !relacion.error) {
            return {
                id_medico: relacion.id_medico,
                obras_sociales_creadas: relacion.obras_sociales_creadas,
                obras_sociales_ya_relacionadas: relacion.obras_sociales_ya_relacionadas,
                obras_sociales_repetidas
            };
        }

        return relacion;
    }
}
