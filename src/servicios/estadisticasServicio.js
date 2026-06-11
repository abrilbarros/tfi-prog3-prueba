import StoredProcedures from "../db/storedProcedures.js";
import PDFDocument from 'pdfkit';

export default class EstadisticasServicio {
    constructor() {
        this.sp = new StoredProcedures();
    }

    obtenerEstadisticasGenerales = async (fecha_desde, fecha_hasta) => {
        if (!fecha_desde || !fecha_hasta) {
            throw new Error("Las fechas son obligatorias");
        }
        return await this.sp.estadisticasGenerales(fecha_desde, fecha_hasta);
    }

    obtenerEstadisticasPorMedico = async (fecha_desde, fecha_hasta) => {
        if (!fecha_desde || !fecha_hasta) {
            throw new Error("Las fechas son obligatorias");
        }
        return await this.sp.estadisticasPorMedico(fecha_desde, fecha_hasta);
    }

    obtenerEstadisticasPorObraSocial = async (fecha_desde, fecha_hasta) => {
        if (!fecha_desde || !fecha_hasta) {
            throw new Error("Las fechas son obligatorias");
        }
        return await this.sp.estadisticasPorObraSocial(fecha_desde, fecha_hasta);
    }

    generarPDF = async (fecha_desde, fecha_hasta) => {
        const estadisticas = await this.obtenerEstadisticasGenerales(fecha_desde, fecha_hasta);
        const porMedico = await this.obtenerEstadisticasPorMedico(fecha_desde, fecha_hasta);
        const porObraSocial = await this.obtenerEstadisticasPorObraSocial(fecha_desde, fecha_hasta);

        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50 });
            const chunks = [];
            
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
            doc.fontSize(20).text('Reporte de Estadísticas de Atenciones', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Período: ${fecha_desde} al ${fecha_hasta}`, { align: 'center' });
            doc.moveDown(2);
            doc.fontSize(16).text('Resumen General', { underline: true });
            doc.moveDown();
            
            if (estadisticas && estadisticas[0]) {
                const est = estadisticas[0];
                doc.fontSize(12);
                doc.text(`Total de turnos: ${est.total_turnos || 0}`);
                doc.text(`Turnos atendidos: ${est.total_atendidos || 0}`);
                doc.text(`Turnos pendientes: ${est.total_pendientes || 0}`);
                doc.text(`Monto total recaudado: $${parseFloat(est.monto_total || 0).toFixed(2)}`);
                doc.text(`Promedio por consulta: $${parseFloat(est.promedio_consulta || 0).toFixed(2)}`);
            }
            
            doc.moveDown(2);
            doc.fontSize(16).text('Atenciones por Médico', { underline: true });
            doc.moveDown();
            
            if (porMedico && porMedico.length > 0) {
                doc.fontSize(12);
                for (const medico of porMedico) {
                    doc.text(`${medico.apellido}, ${medico.nombres}: ${medico.total_atenciones || 0} atenciones - $${parseFloat(medico.monto_generado || 0).toFixed(2)}`);
                }
            } else {
                doc.text('No hay datos disponibles');
            }
            
            doc.moveDown(2);
            doc.fontSize(16).text('Atenciones por Obra Social', { underline: true });
            doc.moveDown();
            
            if (porObraSocial && porObraSocial.length > 0) {
                doc.fontSize(12);
                for (const os of porObraSocial) {
                    doc.text(`${os.nombre}: ${os.total_turnos || 0} turnos - $${parseFloat(os.monto_total || 0).toFixed(2)}`);
                }
            } else {
                doc.text('No hay datos disponibles');
            }
            
            doc.moveDown(2);
            doc.fontSize(10).text(`Reporte generado el ${new Date().toLocaleString()}`, { align: 'center' });
            
            doc.end();
        });
    }
}