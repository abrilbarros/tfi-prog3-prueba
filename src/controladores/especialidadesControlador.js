import EspecialidadesServicio from "../servicios/especialidadesServicio.js";

export default class EspecialidadesControlador {
    constructor() {
        this.especialidades = new EspecialidadesServicio();
    }

    // Obtener todas las especialidades
    buscarTodas = async (req, res) => {
        try {
            const especialidades = await this.especialidades.buscarTodas();

            if (especialidades.length === 0) {
                return res.status(404).json({
                    estado: false,
                    msg: "No se encontraron especialidades."
                });
            }

            res.status(200).json({
                estado: true,
                especialidades: especialidades
            });

        } catch (error) {
            console.log(`Error en GET /especialidades ${error}`);

            res.status(500).json({
                estado: false,
                msg: "Error interno."
            });
        }
    }

    // Obtener especialidad por ID
    buscarPorId = async (req, res) => {
        try {
            const id_especialidad = req.params.id_especialidad;

            // Verifica si la especialidad existe
            const especialidad = await this.especialidades.buscarPorId(id_especialidad);

            if (!especialidad) {
                return res.status(404).json({
                    estado: false,
                    msg: "Especialidad no encontrada."
                });
            }

            res.status(200).json({
                estado: true,
                especialidad: especialidad
            });

        } catch (error) {
            console.log(`Error en GET /especialidades/:id_especialidad ${error}`);

            res.status(500).json({
                estado: false,
                msg: "Error interno."
            });
        }
    }

    // Crear una nueva especialidad
    crear = async (req, res) => {
        try {
            const { nombre } = req.body;

            const idCreado = await this.especialidades.crear(nombre);

            res.status(201).json({
                estado: true,
                msg: `Especialidad creada correctamente (ID: ${idCreado}).`
            });

        } catch (error) {
            console.log(`Error en POST /especialidades ${error}`);

            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    estado: false,
                    msg: "Ya existe una especialidad con ese nombre."
                });
            }

            res.status(500).json({
                estado: false,
                msg: "Error interno."
            });
        }
    }

    // Modificar una especialidad existente
    modificar = async (req, res) => {
        try {
            const id_especialidad = req.params.id_especialidad;
            const { nombre } = req.body;

            // Verifica si la especialidad existe
            const especialidad = await this.especialidades.buscarPorId(id_especialidad);

            if (!especialidad) {
                return res.status(404).json({
                    estado: false,
                    msg: "Especialidad no encontrada."
                });
            }

            await this.especialidades.modificar(id_especialidad, nombre);

            res.status(200).json({
                estado: true,
                msg: "Especialidad modificada."
            });

        } catch (error) {
            console.log(`Error en PUT /especialidades/:id_especialidad ${error}`);

            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    estado: false,
                    msg: "Ya existe una especialidad con ese nombre."
                });
            }

            res.status(500).json({
                estado: false,
                msg: "Error interno."
            });
        }
    }

    // Baja lógica de especialidad
    borrar = async (req, res) => {
        try {
            const id_especialidad = req.params.id_especialidad;

            // Verifica si la especialidad existe
            const especialidad = await this.especialidades.buscarPorId(id_especialidad);

            if (!especialidad) {
                return res.status(404).json({
                    estado: false,
                    msg: "Especialidad no encontrada."
                });
            }

            await this.especialidades.borrar(id_especialidad);

            res.status(200).json({
                estado: true,
                msg: "Especialidad eliminada."
            });

        } catch (error) {
            console.log(`Error en DELETE /especialidades/:id_especialidad ${error}`);

            res.status(500).json({
                estado: false,
                msg: "Error interno."
            });
        }
    }
}