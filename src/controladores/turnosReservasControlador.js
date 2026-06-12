import TurnosServicio from "../servicios/turnosReservasServicio.js";

export default class TurnosControlador {
    constructor() {
        this.turnos = new TurnosServicio();
    }

    buscarTodas = async (req, res) => {
        try {
            const turnos = await this.turnos.buscarTodas();

            if (turnos.length === 0) {
                return res.status(404).json({
                    estado: false,
                    mensaje: "No se encontraron turnos."
                });
            }

            res.status(200).json({
                estado: true,
                turnos: turnos
            });

        } catch (error) {
            console.log(`Error en GET /turnos ${error}`);
            res.status(500).json({
                estado: false,
                mensaje: "Error interno."
            });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const id_turno = req.params.id_turno;
            const turno = await this.turnos.buscarPorId(id_turno);

            if (!turno) {
                return res.status(404).json({
                    estado: false,
                    mensaje: "Turno no encontrado."
                });
            }

            res.status(200).json({
                estado: true,
                turno: turno
            });

        } catch (error) {
            console.log(`Error en GET /turnos/:id_turno ${error}`);
            res.status(500).json({
                estado: false,
                mensaje: "Error interno."
            });
        }
    }

    buscarPorMedico = async (req, res) => {
        try {
            const id_medico = req.params.id_medico;
            const turnos = await this.turnos.buscarPorMedico(id_medico);

            res.status(200).json({
                estado: true,
                turnos: turnos
            });

        } catch (error) {
            console.log(`Error en GET /turnos/medico/:id_medico ${error}`);
            res.status(500).json({
                estado: false,
                mensaje: "Error interno."
            });
        }
    }

    buscarPorPaciente = async (req, res) => {
        try {
            const id_paciente = req.params.id_paciente;
            const turnos = await this.turnos.buscarPorPaciente(id_paciente);

            res.status(200).json({
                estado: true,
                turnos: turnos
            });

        } catch (error) {
            console.log(`Error en GET /turnos/paciente/:id_paciente ${error}`);
            res.status(500).json({
                estado: false,
                mensaje: "Error interno."
            });
        }
    }

    crear = async (req, res) => {
        try {
            const { id_medico, id_paciente, id_obra_social, fecha_hora } = req.body;

            const turnoCreado = await this.turnos.crear({
                id_medico,
                id_paciente,
                id_obra_social,
                fecha_hora
            });

            res.status(201).json({
                estado: true,
                mensaje: "Turno creado correctamente.",
                turno: turnoCreado
            });

        } catch (error) {
            console.log(`Error en POST /turnos ${error}`);
            
            if (error.message === "Médico no encontrado" || 
                error.message === "Obra social no encontrada" ||
                error.message === "El médico no está disponible en ese horario") {
                return res.status(400).json({
                    estado: false,
                    mensaje: error.message
                });
            }

            res.status(500).json({
                estado: false,
                mensaje: "Error interno."
            });
        }
    }

    marcarAtendido = async (req, res) => {
        try {
            const id_turno = req.params.id_turno;
            await this.turnos.marcarAtendido(id_turno);

            res.status(200).json({
                estado: true,
                mensaje: "Turno marcado como atendido."
            });

        } catch (error) {
            console.log(`Error en PUT /turnos/:id_turno/marcar-atendido ${error}`);
            
            if (error.message === "Turno no encontrado") {
                return res.status(404).json({
                    estado: false,
                    mensaje: error.message
                });
            }
            if (error.message === "El turno ya fue atendido") {
                return res.status(400).json({
                    estado: false,
                    mensaje: error.message
                });
            }

            res.status(500).json({
                estado: false,
                mensaje: "Error interno."
            });
        }
    }

    cancelar = async (req, res) => {
        try {
            const id_turno = req.params.id_turno;
            await this.turnos.cancelar(id_turno);

            res.status(200).json({
                estado: true,
                mensaje: "Turno cancelado correctamente."
            });

        } catch (error) {
            console.log(`Error en DELETE /turnos/:id_turno ${error}`);
            
            if (error.message === "Turno no encontrado") {
                return res.status(404).json({
                    estado: false,
                    mensaje: error.message
                });
            }
            if (error.message === "No se puede cancelar un turno ya atendido") {
                return res.status(400).json({
                    estado: false,
                    mensaje: error.message
                });
            }

            res.status(500).json({
                estado: false,
                mensaje: "Error interno."
            });
        }
    }
}