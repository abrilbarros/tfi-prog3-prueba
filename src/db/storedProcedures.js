import { pool } from "./conexion.js";

export default class StoredProcedures {
    
    estadisticasGenerales = async (fecha_desde, fecha_hasta) => {
        const sql = "CALL sp_estadisticas_atenciones(?, ?)";
        const [result] = await pool.query(sql, [fecha_desde, fecha_hasta]);
        return result[0];
    }

    estadisticasPorMedico = async (fecha_desde, fecha_hasta) => {
        const sql = "CALL sp_estadisticas_por_medico(?, ?)";
        const [result] = await pool.query(sql, [fecha_desde, fecha_hasta]);
        return result[0];
    }

    estadisticasPorObraSocial = async (fecha_desde, fecha_hasta) => {
        const sql = "CALL sp_estadisticas_por_obra_social(?, ?)";
        const [result] = await pool.query(sql, [fecha_desde, fecha_hasta]);
        return result[0];
    }
}