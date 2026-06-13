import apicache from "apicache";

import Especialidades from "../db/especialidades.js"
import EspecialidadesRespuestaDTO from "../dtos/especialidadesRespuestaDTO.js";


export default class EspecialidadesServicio {

    constructor() {
        this.especialidades = new Especialidades();
    }

    buscarTodas = async () => {
        const especialidades = await this.especialidades.buscarTodas();
        return especialidades.map(especialidad => new EspecialidadesRespuestaDTO(especialidad));
    }

    buscarPorId = async (id_especialidad) => {
        const especialidad = await this.especialidades.buscarPorId(id_especialidad);

        if (!especialidad) {
            return null;
        }

        return new EspecialidadesRespuestaDTO(especialidad);
    }


    crear = async (especialidad) => {
        const nuevo_id = await this.especialidades.crear(especialidad);

        apicache.clear();

        return this.buscarPorId(nuevo_id);
    }

    modificar = async (id_especialidad, especialidad) => {

        // Verifica si existe la especialidad
        const existe = await this.especialidades.buscarPorId(id_especialidad);

        if (!existe) {
            return null;
        }

        const modificado = await this.especialidades.modificar(
            id_especialidad,
            especialidad
        );

        apicache.clear();

        // Devuelve la especialidad modificada
        return this.buscarPorId(modificado);
    }

    eliminar = async (id_especialidad) => {
        const existe = await this.especialidades.buscarPorId(id_especialidad);

        if (!existe) {
            return null;
        }

        const eliminado = await this.especialidades.eliminar(id_especialidad);

        apicache.clear();

        return eliminado;
    }
}