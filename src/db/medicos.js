import { pool } from "./conexion.js";

export default class Medicos {

    buscarTodos = async () => {
        const sql = "SELECT * FROM v_medicos";
        const [medicos] = await pool.execute(sql);
        return medicos;
    }

    buscarPorId = async (id_medico) => {
        const sql = `
            SELECT medicos.*
            FROM medicos
            INNER JOIN usuarios ON medicos.id_usuario = usuarios.id_usuario
            WHERE usuarios.activo = 1
            AND medicos.id_medico = ?
        `;
        const [medico] = await pool.execute(sql, [id_medico]);
        if (medico.length === 0) {
            return null;
        }

        return medico[0];
    }

    relacionarConObraSocial = async (id_medico, obras_sociales) => {

        const conexion = await pool.getConnection();

        try {
            await conexion.beginTransaction();

            const sqlMedico = `
                SELECT medicos.id_medico
                FROM medicos
                INNER JOIN usuarios ON medicos.id_usuario = usuarios.id_usuario
                WHERE usuarios.activo = 1
                AND medicos.id_medico = ?
            `;

            const [medico] = await conexion.execute(sqlMedico, [id_medico]);

            if (medico.length === 0) {
                await conexion.rollback();
                conexion.release();

                return {
                    error: "MEDICO_NO_ENCONTRADO"
                };
            }

            const obrasSocialesNoEncontradas = [];
            const obrasSocialesCreadas = [];
            const obrasSocialesYaRelacionadas = [];

            for (const obra_social of obras_sociales) {
                const sqlObraSocial = `
                    SELECT id_obra_social
                    FROM obras_sociales
                    WHERE activo = 1
                    AND id_obra_social = ?
                `;

                const [obraSocial] = await conexion.execute(
                    sqlObraSocial,
                    [obra_social.id_obra_social]
                );

                if (obraSocial.length === 0) {
                    obrasSocialesNoEncontradas.push(obra_social.id_obra_social);
                }
            }

            if (obrasSocialesNoEncontradas.length > 0) {
                await conexion.rollback();
                conexion.release();

                return {
                    error: "OBRAS_SOCIALES_NO_ENCONTRADAS",
                    obras_sociales_no_encontradas: obrasSocialesNoEncontradas
                };
            }

            for (const obra_social of obras_sociales) {

                // Verifica si la relación ya existe
                const sqlVerificar = `
                SELECT *
                FROM medicos_obras_sociales
                WHERE id_medico = ?
                AND id_obra_social = ?
            `;

                const [existe] = await conexion.execute(
                    sqlVerificar,
                    [id_medico, obra_social.id_obra_social]
                );

                // Si la relación ya existe, continúa con la siguiente
                if (existe.length > 0) {
                    obrasSocialesYaRelacionadas.push(obra_social.id_obra_social);
                    continue;
                }

                // Crear relación entre médico y obra social
                const sql = `
                INSERT INTO medicos_obras_sociales
                (id_medico, id_obra_social)
                VALUES (?, ?);
            `;

                await conexion.execute(
                    sql,
                    [id_medico, obra_social.id_obra_social]
                );

                obrasSocialesCreadas.push(obra_social.id_obra_social);
            }

            await conexion.commit();
            conexion.release();

            return {
                id_medico: Number(id_medico),
                obras_sociales_creadas: obrasSocialesCreadas,
                obras_sociales_ya_relacionadas: obrasSocialesYaRelacionadas
            };

        } catch (error) {
            await conexion.rollback();
            conexion.release();

            console.log(`Error al relacionar medico con obras sociales: ${error}`);
            throw error;
        }
    }
}
