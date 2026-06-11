import EstadisticasServicio from "../servicios/estadisticasServicio.js";

export default class EstadisticasControlador {
    constructor() {
        this.estadisticas = new EstadisticasServicio();
    }

    obtenerEstadisticasGenerales = async (req, res) => {
        try {
            const { fecha_desde, fecha_hasta } = req.query;

            if (!fecha_desde || !fecha_hasta) {
                return res.status(400).json({
                    estado: false,
                    mensaje: "Los parámetros fecha_desde y fecha_hasta son obligatorios"
                });
            }

            const estadisticas = await this.estadisticas.obtenerEstadisticasGenerales(fecha_desde, fecha_hasta);

            res.status(200).json({
                estado: true,
                estadisticas: estadisticas
            });

        } catch (error) {
            console.log(`Error en GET /estadisticas ${error}`);
            res.status(500).json({
                estado: false,
                mensaje: "Error interno."
            });
        }
    }

    obtenerEstadisticasPorMedico = async (req, res) => {
        try {
            const { fecha_desde, fecha_hasta } = req.query;

            if (!fecha_desde || !fecha_hasta) {
                return res.status(400).json({
                    estado: false,
                    mensaje: "Los parámetros fecha_desde y fecha_hasta son obligatorios"
                });
            }

            const estadisticas = await this.estadisticas.obtenerEstadisticasPorMedico(fecha_desde, fecha_hasta);

            res.status(200).json({
                estado: true,
                estadisticas: estadisticas
            });

        } catch (error) {
            console.log(`Error en GET /estadisticas/medicos ${error}`);
            res.status(500).json({
                estado: false,
                mensaje: "Error interno."
            });
        }
    }

    obtenerEstadisticasPorObraSocial = async (req, res) => {
        try {
            const { fecha_desde, fecha_hasta } = req.query;

            if (!fecha_desde || !fecha_hasta) {
                return res.status(400).json({
                    estado: false,
                    mensaje: "Los parámetros fecha_desde y fecha_hasta son obligatorios"
                });
            }

            const estadisticas = await this.estadisticas.obtenerEstadisticasPorObraSocial(fecha_desde, fecha_hasta);

            res.status(200).json({
                estado: true,
                estadisticas: estadisticas
            });

        } catch (error) {
            console.log(`Error en GET /estadisticas/obras-sociales ${error}`);
            res.status(500).json({
                estado: false,
                mensaje: "Error interno."
            });
        }
    }

    generarPDF = async (req, res) => {
        try {
            const { fecha_desde, fecha_hasta } = req.query;

            if (!fecha_desde || !fecha_hasta) {
                return res.status(400).json({
                    estado: false,
                    mensaje: "Los parámetros fecha_desde y fecha_hasta son obligatorios"
                });
            }

            const pdfBuffer = await this.estadisticas.generarPDF(fecha_desde, fecha_hasta);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=estadisticas_${fecha_desde}_${fecha_hasta}.pdf`);
            res.send(pdfBuffer);

        } catch (error) {
            console.log(`Error en GET /estadisticas/pdf ${error}`);
            res.status(500).json({
                estado: false,
                mensaje: "Error al generar el PDF"
            });
        }
    }
}