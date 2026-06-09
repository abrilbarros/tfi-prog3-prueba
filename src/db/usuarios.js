import { pool } from "./conexion.js";

export default class Usuarios {

    crearUsuario = async (usuario) => {
        const { documento, apellido, nombres, email, contrasenia, rol} = usuario;
        const sql = `
        INSERT INTO usuarios
        (documento, apellido, nombres, email, contrasenia, rol)
        VALUES (?, ?, ?, ?, ?, ?)`;

        const [resultado] = await pool.execute(sql, [
            documento,
            apellido,
            nombres,
            email,
            contrasenia,
            rol
        ]);

        if (resultado.affectedRows === 0) {
            return null;
        }

        return resultado.insertId;
    }

    crearMedico = async (id_usuario, medico) => {
        const {id_especialidad, matricula, descripcion, valor_consulta } = medico;
        const sql = `
        INSERT INTO medicos
        (id_usuario, id_especialidad, matricula, descripcion, valor_consulta)
        VALUES (?, ?, ?, ?, ?)`;

        const [resultado] = await pool.execute(sql, [
            id_usuario,
            id_especialidad,
            matricula,
            descripcion ?? null,
            valor_consulta
        ]);

        if (resultado.affectedRows === 0) {
            return null;
        }

        return resultado.insertId;
    }

    crearPaciente = async (id_usuario, paciente) => {
        const { id_obra_social } = paciente;
        const sql = `
        INSERT INTO pacientes
        (id_usuario, id_obra_social)
        VALUES (?, ?)`;

        const [resultado] = await pool.execute(sql, [
            id_usuario,
            id_obra_social
        ]);

        if (resultado.affectedRows === 0) {
            return null;
        }

        return resultado.insertId;
    }

    buscarPorId = async (id_usuario) => {
        const sql = `SELECT * FROM usuarios WHERE id_usuario = ?`;
        const [usuario] = await pool.execute(sql, [id_usuario]);
        return usuario[0];
    }

    buscar = async (email, contrasenia) => {
        const sql = `SELECT u.id_usuario, CONCAT(u.nombres, ' ', u.apellido) as usuario, u.rol
                        FROM usuarios AS u
                        WHERE u.email = ?
                            AND u.contrasenia = SHA2(?,256)
                            AND u.activo = 1`;
        const [result] = await pool.execute(sql, [email, contrasenia]);
        return result[0];
    }
}