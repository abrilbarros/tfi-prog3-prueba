import Especialidades from "../db/especialidades.js"
import apicache from "apicache";


export default class EspecialidadesServicio {

    constructor() {
        this.especialidades = new Especialidades();
    }

    buscarTodas = () => {
        return this.especialidades.buscarTodas();
    }

    buscarPorId = (id_especialidad) => {
        return this.especialidades.buscarPorId(id_especialidad);
    }


    crear = async (especialidad) => {
        const nuevo_id = await this.especialidades.crear(especialidad);

        apicache.clear();

        return this.buscarPorId(nuevo_id);
    }

    modificar = async (id_especialidad, especialidad) => {

        // Verifica si existe la especialidad
        const existe = await this.especialidades.buscarPorId(id_especialidad);

        if (existe.length === 0) {
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
        // verifica si existe la especialidad a eliminar
        const existe = await this.especialidades.buscarPorId(id_especialidad);
        if (existe.length === 0) {
            return null;
        }

        apicache.clear();
        return this.especialidades.eliminar(id_especialidad);
    }
}