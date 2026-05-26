import express from "express";

import { router as v1EspecialidadesRutas } from "./rutas/v1/especialidadesRutas.js";
import { router as v1ObrasSocialesRutas } from "./rutas/v1/obrasSocialesRutas.js";

import { testConexion } from "./db/test-conexion.js";

process.loadEnvFile();

const app = express();
const PUERTO = process.env.PUERTO || 3000;

await testConexion();

app.use(express.json());

app.get(
    "/",
    (req, res) => {
        res.status(200).json({
            estado: true,
            msg: "API OK."
        });
    }
);

app.use("/api/v1/especialidades", v1EspecialidadesRutas);
app.use("/api/v1/obras-sociales", v1ObrasSocialesRutas);

// Manejo de rutas inexistentes
app.use((req, res) => {
    res.status(404).json({
        estado: false,
        msg: "Ruta no encontrada."
    });
});

app.listen(PUERTO, () => {
    console.log(`servidor iniciado OK en puerto ${PUERTO}`);
});