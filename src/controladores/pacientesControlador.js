import PacientesServicio from "../servicios/pacientesServicio.js";

export default class PacientesControlador {

    constructor() {
        this.pacientes = new PacientesServicio();
    }

    buscarTodos = async (req, res) => {
        try {
            const pacientes = await this.pacientes.buscarTodos();

            if (pacientes.length === 0) {
                return res.status(404).json({
                    estado: false,
                    mensaje: "No se encontraron pacientes."
                });
            }

            return res.status(200).json({
                estado: true,
                mensaje: "Pacientes encontrados.",
                datos: pacientes
            });

        } catch (error) {
            console.log(`Error en GET /pacientes ${error}`);
            res.status(500).json({
                estado: false,
                mensaje: "Error interno."
            });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const id_paciente = req.params.id_paciente;
            const paciente = await this.pacientes.buscarPorId(id_paciente);

            if (!paciente) {
                return res.status(404).json({
                    estado: false,
                    mensaje: "Paciente no encontrado."
                });
            }

            return res.status(200).json({
                estado: true,
                mensaje: "Paciente encontrado.",
                datos: paciente
            });

        } catch (error) {
            console.log(`Error en GET /pacientes/:id_paciente ${error}`);
            res.status(500).json({
                estado: false,
                mensaje: "Error interno."
            });
        }
    }
}