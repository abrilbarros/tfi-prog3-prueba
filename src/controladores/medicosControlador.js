import MedicosServicio from "../servicios/medicosServicio.js";

export default class MedicosControlador {

    constructor() {
        this.medicos = new MedicosServicio();
    }

    // Obtener todos los médicos
    buscarTodos = async (req, res) => {
        try {
            const medicos = await this.medicos.buscarTodos();

            if (medicos.length === 0) {
                return res.status(404).json({
                    estado: false,
                    mensaje: "No se encontraron médicos."
                });
            }

            return res.status(200).json({
                estado: true,
                mensaje: "Médicos encontrados.",
                datos: medicos
            });

        } catch (error) {
            console.log(`Error en GET /medicos ${error}`);
            res.status(500).json({
                estado: false,
                mensaje: "Error interno."
            });
        }
    }

    // Obtener médico por ID
    buscarPorId = async (req, res) => {
        try {
            const id_medico = req.params.id_medico;
            const medico = await this.medicos.buscarPorId(id_medico);

            if (!medico) {
                return res.status(404).json({
                    estado: false,
                    mensaje: "Médico no encontrado."
                });
            }

            return res.status(200).json({
                estado: true,
                mensaje: "Médico encontrado.",
                datos: medico
            });

        } catch (error) {
            console.log(`Error en GET /medicos/:id_medico ${error}`);
            res.status(500).json({
                estado: false,
                mensaje: "Error interno."
            });
        }
    }

    // Asociar médico con obras sociales
    asociarMedicoObrasSociales = async (req, res) => {
        try {
            const { id_medico, obras_sociales } = req.dto;

            const relacion = await this.medicos.asociarMedicoObrasSociales(
                id_medico,
                obras_sociales
            );

            if (!relacion) {
                return res.status(400).json({
                    estado: false,
                    mensaje: "No se crearon las relaciones."
                });
            }

            return res.status(201).json({
                estado: true,
                mensaje: "Médico y obras sociales relacionadas.",
                datos: relacion
            });

        } catch (error) {
            console.log(`Error en POST /medicos/obras-sociales ${error}`);

            res.status(500).json({
                estado: false,
                mensaje: "Error interno."
            });
        }
    }
}
