import request from 'supertest';
import app from './src/turnos.js';

const testear = async () => {
    console.log('Probando GET /api/v1/turnos...');
    const res = await request(app).get('/api/v1/turnos');
    console.log(`   Status: ${res.statusCode} - ${res.statusCode === 200 ? '✅' : '❌'}`);
    
    console.log('Probando GET /api/v1/estadisticas...');
    const res2 = await request(app).get('/api/v1/estadisticas?fecha_desde=2026-01-01&fecha_hasta=2026-12-31');
    console.log(`   Status: ${res2.statusCode} - ${res2.statusCode === 200 ? '✅' : '❌'}`);
    
    process.exit(0);
};

testear();