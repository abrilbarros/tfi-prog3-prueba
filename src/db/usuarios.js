import { pool } from "./conexion.js";

export default class Usuarios {

    crearUsuario = async (usuario, conexion) => {
        const { documento, apellido, nombres, email, contrasenia, rol} = usuario;
        const sql = `
        INSERT INTO usuarios
        (documento, apellido, nombres, email, contrasenia, rol)
        VALUES (?, ?, ?, ?, ?, ?)`;

        const [resultado] = await conexion.execute(sql, [
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

    crearMedico = async (id_usuario, medico, conexion) => {
        const {id_especialidad, matricula, descripcion, valor_consulta } = medico;
        const sql = `
        INSERT INTO medicos
        (id_usuario, id_especialidad, matricula, descripcion, valor_consulta)
        VALUES (?, ?, ?, ?, ?)`;

        const [resultado] = await conexion.execute(sql, [
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

    crearPaciente = async (id_usuario, paciente,conexion) => {
        const { id_obra_social } = paciente;
        const sql = `
        INSERT INTO pacientes
        (id_usuario, id_obra_social)
        VALUES (?, ?)`;

        const [resultado] = await conexion.execute(sql, [
            id_usuario,
            id_obra_social
        ]);

        if (resultado.affectedRows === 0) {
            return null;
        }

        return resultado.insertId;
    }

    listarAdmins = async () => {
    const sql = `SELECT id_usuario, documento, apellido, nombres, email 
                 FROM usuarios 
                 WHERE rol = 3 AND activo = 1`;
    const [result] = await pool.execute(sql);
    return result;
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

    modificarUsuario = async (id_usuario, datosUsuario, conexion) => {
        const updates  = [];
        const values = [];

        if(datosUsuario.email != null) {
            updates.push('email = ?');
            values.push(datosUsuario.email);
        }

        if(updates.length === 0) {
            return null
        }

        const sql = `UPDATE usuarios SET ${updates.join(', ')} WHERE id_usuario = ?`;
        values.push(id_usuario);

        const [result] = await conexion.execute(sql, values);
        if (result.affectedRows === 0){
            return null;
        }
    }

    modificarMedico = async (id_usuario, datosMedico, conexion) => {
        const updates  = [];
        const values = [];

        if(datosMedico.descripcion != null) {
            updates.push('descripcion = ?');
            values.push(datosMedico.descripcion);
        }

        if(datosMedico.valor_consulta != null) {
            updates.push('valor_consulta = ?');
            values.push(datosMedico.valor_consulta);
        }

        if(datosMedico.id_especialidad != null) {
            updates.push('id_especialidad = ?');
            values.push(datosMedico.id_especialidad);
        }

        if(updates.length === 0) {
            return null
        }

        const sql = `UPDATE medicos SET ${updates.join(', ')} WHERE id_usuario = ?`;
        values.push(id_usuario);

        const [result] = await conexion.execute(sql, values);
        if (result.affectedRows === 0){
            return null;
        }
    }

    modificarPaciente = async (id_usuario, datosPaciente, conexion) => {
        const updates  = [];
        const values = [];

        if(datosPaciente.id_obra_social != null) {
            updates.push('id_obra_social = ?');
            values.push(datosPaciente.id_obra_social);
        }

        if(updates.length === 0) {
            return null
        }

        const sql = `UPDATE pacientes SET ${updates.join(', ')} WHERE id_usuario = ?`;
        values.push(id_usuario);

        const [result] = await conexion.execute(sql, values);
        if (result.affectedRows === 0){
            return null;
        }
    }

    eliminar  = async(id_usuario) => {
        const sql = 'UPDATE usuarios SET activo = 0 WHERE id_usuario = ?';
        const [result] = await pool.execute(sql, [id_usuario]);
        if (result.affectedRows === 0){
            return null;
        }
        return id_usuario;
    }
}