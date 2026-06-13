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
                    mensaje: "No se encontraron especialidades."
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
                mensaje: "Error interno."
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
                    mensaje: "Especialidad no encontrada."
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
                mensaje: "Error interno."
            });
        }
    }

    // Crear una nueva especialidad
    crear = async (req, res) => {
        try {
            const especialidad = req.dto;

            const nuevaEspecialidad = await this.especialidades.crear(especialidad);

            res.status(201).json({
                estado: true,
                mensaje: "Especialidad creada correctamente.",
                especialidad: nuevaEspecialidad
            });

        } catch (error) {
            console.log(`Error en POST /especialidades ${error}`);

            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    estado: false,
                    mensaje: "Ya existe una especialidad con ese nombre."
                });
            }

            res.status(500).json({
                estado: false,
                mensaje: "Error interno."
            });
        }
    }

    // Modificar una especialidad existente
    modificar = async (req, res) => {
        try {
            const id_especialidad = req.params.id_especialidad;
            const especialidad = req.dto;

            if (Object.keys(especialidad).length === 1) {
                return res.status(400).json({
                    estado: false,
                    mensaje: "No se recibieron los datos de la especialidad para modificar."
                });
            }

            const especialidadModificada = await this.especialidades.modificar(
                id_especialidad,
                especialidad
            );

            if (!especialidadModificada) {
                return res.status(404).json({
                    estado: false,
                    mensaje: "Especialidad no encontrada."
                });
            }

            res.status(200).json({
                estado: true,
                mensaje: "Especialidad modificada.",
                especialidad: especialidadModificada
            });

        } catch (error) {
            console.log(`Error en PUT /especialidades/:id_especialidad ${error}`);

            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    estado: false,
                    mensaje: "Ya existe una especialidad con ese nombre."
                });
            }

            res.status(500).json({
                estado: false,
                mensaje: "Error interno."
            });
        }
    }

    // Eliminar una especialidad (baja lógica)
    eliminar = async (req, res) => {
        try {
            const id_especialidad = req.params.id_especialidad;

            // Buscar especialidad en la base de datos
            const especialidad = await this.especialidades.buscarPorId(id_especialidad);

            // Verifica si la especialidad existe
            if (!especialidad) {
                return res.status(404).json({
                    estado: false,
                    mensaje: "Especialidad no encontrada."
                });
            }

            // Eliminar especialidad de la base de datos
            await this.especialidades.eliminar(id_especialidad);

            // Devuelve mensaje indicando que la especialidad fue eliminada
            return res.status(200).json({
                estado: true,
                mensaje: "Especialidad eliminada.",
                especialidad: {
                    id_especialidad: especialidad.id_especialidad,
                    especialidad: especialidad.nombre
                }
            });

        } catch (error) {
            console.log(`Error en DELETE /especialidades/:id_especialidad ${error}`);

            res.status(500).json({
                estado: false,
                mensaje: "Error interno."
            });
        }
    }
}
