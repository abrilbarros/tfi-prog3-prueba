import Turnos from "../db/turnosReservas.js";
import { pool } from "../db/conexion.js";

export default class TurnosServicio {
    constructor() {
        this.turnos = new Turnos();
    }

    calcularValorTotal = (valorConsulta, porcentajeDescuento, esParticular) => {
        if (esParticular === 1) {
            return parseFloat(valorConsulta);
        }
        const descuento = (parseFloat(porcentajeDescuento) / 100) * parseFloat(valorConsulta);
        return parseFloat(valorConsulta) - descuento;
    }

    buscarTodas = async () => {
        return await this.turnos.buscarTodas();
    }

    buscarPorId = async (id_turno) => {
        const turno = await this.turnos.buscarPorId(id_turno);
        if (!turno) return null;
        return turno;
    }

    buscarPorMedico = async (id_medico) => {
        return await this.turnos.buscarPorMedico(id_medico);
    }

    buscarPorPaciente = async (id_paciente) => {
        return await this.turnos.buscarPorPaciente(id_paciente);
    }

    crear = async (datosTurno) => {
        const { id_medico, id_paciente, id_obra_social, fecha_hora } = datosTurno;

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            const [medicoRows] = await connection.query(
                "SELECT valor_consulta FROM medicos WHERE id_medico = ?",
                [id_medico]
            );
            const [obraSocialRows] = await connection.query(
                "SELECT porcentaje_descuento, es_particular FROM obras_sociales WHERE id_obra_social = ?",
                [id_obra_social]
            );

            if (medicoRows.length === 0) {
                throw new Error("Médico no encontrado");
            }
            if (obraSocialRows.length === 0) {
                throw new Error("Obra social no encontrada");
            }

            const valorConsulta = medicoRows[0].valor_consulta;
            const { porcentaje_descuento, es_particular } = obraSocialRows[0];
            const valor_total = this.calcularValorTotal(valorConsulta, porcentaje_descuento, es_particular);
            const disponible = await this.turnos.verificarDisponibilidad(id_medico, fecha_hora);
            if (!disponible) {
                throw new Error("El médico no está disponible en ese horario");
            }
            const id_turno = await this.turnos.crear(
                id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, connection
            );

            await connection.commit();

            return {
                id_turno_reserva: id_turno,
                valor_total,
                fecha_hora,
                atendido: 0
            };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    marcarAtendido = async (id_turno) => {
        const turno = await this.turnos.buscarPorId(id_turno);
        if (!turno) {
            throw new Error("Turno no encontrado");
        }
        if (turno.atendido === 1) {
            throw new Error("El turno ya fue atendido");
        }
        return await this.turnos.marcarAtendido(id_turno);
    }

    cancelar = async (id_turno) => {
        const turno = await this.turnos.buscarPorId(id_turno);
        if (!turno) {
            throw new Error("Turno no encontrado");
        }
        if (turno.atendido === 1) {
            throw new Error("No se puede cancelar un turno ya atendido");
        }
        return await this.turnos.cancelar(id_turno);
    }
}