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

    asociarMedicoObrasSociales = async (id_medico, obras_sociales) => {
        return await this.medicos.relacionarConObraSocial(id_medico, obras_sociales);
    }
}
