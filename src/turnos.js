import express from "express";
import fs from "fs";
import morgan from "morgan";
import passport from "passport";

import { estrategia,validacion } from "./config/passport.js";

import { router as v1EspecialidadesRutas } from "./rutas/v1/especialidadesRutas.js";
import { router as v1ObrasSocialesRutas } from "./rutas/v1/obrasSocialesRutas.js";
import { router as v1MedicosRutas } from "./rutas/v1/medicosRutas.js";
import { router as v1UsuariosRutas} from "./rutas/v1/usuariosRutas.js";
import { router as v1AuthRutas} from "./rutas/v1/authRutas.js"

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

app.use("/api/v1/especialidades", passport.authenticate('jwt', {session: false}), v1EspecialidadesRutas);
app.use("/api/v1/obras-sociales", passport.authenticate('jwt', {session: false}), v1ObrasSocialesRutas);
app.use('/api/v1/medicos', passport.authenticate('jwt', {session: false}), v1MedicosRutas);
app.use('/api/v1/usuarios', passport.authenticate('jwt', {session: false}), v1UsuariosRutas);
app.use('/api/v1/auth', v1AuthRutas);

// Manejo de rutas inexistentes
app.use((req, res) => {
    res.status(404).json({
        estado: false,
        mensaje: "Ruta no encontrada."
    });
});

export default app;