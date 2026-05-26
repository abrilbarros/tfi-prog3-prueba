import { pool } from "./conexion.js";

export default class Especialidades {
    buscarTodas = async () => {
        const sql = "SELECT * FROM especialidades WHERE activo = 1";

        const [especialidades] = await pool.execute(sql);

        return especialidades;
    }

    buscarPorId = async (id_especialidad) => {
        const sql = "SELECT * FROM especialidades WHERE activo = 1 AND id_especialidad = ?";

        const [especialidades] = await pool.execute(sql, [id_especialidad]);

        if (especialidades.length === 0) {
            return null;
        }

        return especialidades[0];
    }

    crear = async (nombre) => {
        const sql = "INSERT INTO especialidades (nombre) VALUES (?)";

        const [resultado] = await pool.execute(sql, [nombre]);

        return resultado.insertId;
    }

    modificar = async (id_especialidad, nombre) => {
        const sql = "UPDATE especialidades SET nombre = ? WHERE id_especialidad = ?";

        const [resultado] = await pool.execute(sql, [nombre, id_especialidad]);

        return resultado;
    }

    // activo = 0 representa baja lógica (el registro no se elimina físicamente)
    borrar = async (id_especialidad) => {
        const sql = "UPDATE especialidades SET activo = 0 WHERE id_especialidad = ?";

        const [resultado] = await pool.execute(sql, [id_especialidad]);

        return resultado;
    }
}