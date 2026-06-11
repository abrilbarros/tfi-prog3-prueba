import { pool } from "./conexion.js";

export default class Turnos {
    buscarTodas = async () => {
        const sql = `
            SELECT 
                t.id_turno_reserva,
                t.fecha_hora,
                t.valor_total,
                t.atendido,
                u_medico.apellido AS medico_apellido,
                u_medico.nombres AS medico_nombres,
                u_paciente.apellido AS paciente_apellido,
                u_paciente.nombres AS paciente_nombres,
                e.nombre AS especialidad,
                os.nombre AS obra_social
            FROM turnos_reservas t
            INNER JOIN medicos m ON t.id_medico = m.id_medico
            INNER JOIN usuarios u_medico ON m.id_usuario = u_medico.id_usuario
            INNER JOIN pacientes p ON t.id_paciente = p.id_paciente
            INNER JOIN usuarios u_paciente ON p.id_usuario = u_paciente.id_usuario
            INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
            INNER JOIN obras_sociales os ON t.id_obra_social = os.id_obra_social
            WHERE t.activo = 1
            ORDER BY t.fecha_hora DESC
        `;
        const [turnos] = await pool.query(sql);
        return turnos;
    }

    buscarPorId = async (id_turno) => {
        const sql = `
            SELECT 
                t.id_turno_reserva,
                t.id_medico,
                t.id_paciente,
                t.id_obra_social,
                t.fecha_hora,
                t.valor_total,
                t.atendido,
                m.valor_consulta,
                os.porcentaje_descuento,
                os.es_particular
            FROM turnos_reservas t
            INNER JOIN medicos m ON t.id_medico = m.id_medico
            INNER JOIN obras_sociales os ON t.id_obra_social = os.id_obra_social
            WHERE t.id_turno_reserva = ? AND t.activo = 1
        `;
        const [turnos] = await pool.execute(sql, [id_turno]);
        if (turnos.length === 0) return null;
        return turnos[0];
    }

    buscarPorMedico = async (id_medico) => {
        const sql = `
            SELECT 
                t.id_turno_reserva,
                t.fecha_hora,
                t.valor_total,
                t.atendido,
                u_paciente.apellido AS paciente_apellido,
                u_paciente.nombres AS paciente_nombres,
                e.nombre AS especialidad
            FROM turnos_reservas t
            INNER JOIN pacientes p ON t.id_paciente = p.id_paciente
            INNER JOIN usuarios u_paciente ON p.id_usuario = u_paciente.id_usuario
            INNER JOIN medicos m ON t.id_medico = m.id_medico
            INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
            WHERE t.id_medico = ? AND t.activo = 1
            ORDER BY t.fecha_hora ASC
        `;
        const [turnos] = await pool.execute(sql, [id_medico]);
        return turnos;
    }

    buscarPorPaciente = async (id_paciente) => {
        const sql = `
            SELECT 
                t.id_turno_reserva,
                t.fecha_hora,
                t.valor_total,
                t.atendido,
                u_medico.apellido AS medico_apellido,
                u_medico.nombres AS medico_nombres,
                e.nombre AS especialidad
            FROM turnos_reservas t
            INNER JOIN medicos m ON t.id_medico = m.id_medico
            INNER JOIN usuarios u_medico ON m.id_usuario = u_medico.id_usuario
            INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
            WHERE t.id_paciente = ? AND t.activo = 1
            ORDER BY t.fecha_hora DESC
        `;
        const [turnos] = await pool.execute(sql, [id_paciente]);
        return turnos;
    }

    verificarDisponibilidad = async (id_medico, fecha_hora) => {
        const sql = `
            SELECT COUNT(*) AS cantidad 
            FROM turnos_reservas 
            WHERE id_medico = ? AND fecha_hora = ? AND activo = 1
        `;
        const [rows] = await pool.execute(sql, [id_medico, fecha_hora]);
        return rows[0].cantidad === 0;
    }

    crear = async (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, connection) => {
        const sql = `
            INSERT INTO turnos_reservas 
            (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atendido) 
            VALUES (?, ?, ?, ?, ?, 0)
        `;
        const [resultado] = await connection.execute(sql, [id_medico, id_paciente, id_obra_social, fecha_hora, valor_total]);
        return resultado.insertId;
    }

    marcarAtendido = async (id_turno) => {
        const sql = "UPDATE turnos_reservas SET atendido = 1 WHERE id_turno_reserva = ? AND activo = 1";
        const [resultado] = await pool.execute(sql, [id_turno]);
        return resultado;
    }

    cancelar = async (id_turno) => {
        const sql = "UPDATE turnos_reservas SET activo = 0 WHERE id_turno_reserva = ?";
        const [resultado] = await pool.execute(sql, [id_turno]);
        return resultado;
    }
}