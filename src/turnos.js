import express from "express";
import fs from "fs";
import morgan from "morgan";
import passport from "passport";
import { setupSwagger } from './docs/swagger.js';

import { estrategia,validacion } from "./config/passport.js";

import { router as v1EspecialidadesRutas } from "./rutas/v1/especialidadesRutas.js";
import { router as v1ObrasSocialesRutas } from "./rutas/v1/obrasSocialesRutas.js";
import { router as v1MedicosRutas } from "./rutas/v1/medicosRutas.js";
import { router as v1UsuariosRutas} from "./rutas/v1/usuariosRutas.js";
import { router as v1AuthRutas} from "./rutas/v1/authRutas.js"
import { router as v1TurnosReservasRutas } from "./rutas/v1/turnosReservasRutas.js";        
import { router as v1EstadisticasRutas } from "./rutas/v1/estadisticasRutas.js"; 

import { testConexion } from "./db/test-conexion.js";


const app = express();

await testConexion();

let log = fs.createWriteStream('./accesos.log', {
    flags: 'a'
})

app.use(morgan('dev'));
app.use(morgan('combined', {stream: log})),

app.use(express.json());

passport.use(estrategia);
passport.use(validacion);
app.use(passport.initialize());

app.get("/", (req, res) => {
        res.status(200).json({
            estado: true,
            msg: "API OK."
        });
    }
);

setupSwagger(app);

app.use("/api/v1/especialidades", passport.authenticate('jwt', {session: false}), v1EspecialidadesRutas);
app.use("/api/v1/obras-sociales", passport.authenticate('jwt', {session: false}), v1ObrasSocialesRutas);
app.use('/api/v1/medicos', passport.authenticate('jwt', {session: false}), v1MedicosRutas);
app.use('/api/v1/usuarios', passport.authenticate('jwt', {session: false}), v1UsuariosRutas);
app.use('/api/v1/auth', v1AuthRutas);
app.use('/api/v1/turnosReservas', passport.authenticate('jwt', {session: false}), v1TurnosReservasRutas);                   
app.use('/api/v1/estadisticas', passport.authenticate('jwt', {session: false}), v1EstadisticasRutas);       

// Manejo de rutas inexistentes
app.use((req, res) => {
    res.status(404).json({
        estado: false,
        mensaje: "Ruta no encontrada."
    });
});

export default app;