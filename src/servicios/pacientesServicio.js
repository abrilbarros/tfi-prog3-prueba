import Pacientes from "../db/pacientes.js";

export default class PacientesServicio {

    constructor() {
        this.pacientes = new Pacientes();
    }

    buscarTodos = async () => {
        const datos = await this.pacientes.buscarTodos();
        return datos;
    }

    buscarPorId = (id_paciente) => {
        return this.pacientes.buscarPorId(id_paciente);
    }
}