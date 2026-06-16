import { pool } from "./conexion.js";

export default class Pacientes {

    buscarTodos = async () => {
        const sql = "SELECT * FROM v_pacientes";
        const [pacientes] = await pool.execute(sql);
        return pacientes;
    }

    buscarPorId = async (id_paciente) => {
        const sql = `
            SELECT *
            FROM v_pacientes
            WHERE id_paciente = ?
        `;

        const [paciente] = await pool.execute(sql, [id_paciente]);

        if (paciente.length === 0) {
            return null;
        }

        return paciente[0];
    }
}
