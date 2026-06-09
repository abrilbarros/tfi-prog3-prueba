import app from './turnos.js';

process.loadEnvFile();

app.listen(process.env.PUERTO || 3000, () => {
    console.log(`Servidor iniciado OK en puerto ${process.env.PUERTO}`);
})