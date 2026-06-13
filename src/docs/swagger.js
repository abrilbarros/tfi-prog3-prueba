import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Clínica Médica',
            version: '1.0.0',
            description: 'API para gestión de turnos médicos - Trabajo Final Integrador',
            contact: {
                name: 'Grupo I',
                email: 'grupoi@uner.edu.ar'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de desarrollo'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            },
            schemas: {
                Turno: {
                    type: 'object',
                    properties: {
                        id_turno_reserva: { type: 'integer', example: 1 },
                        fecha_hora: { type: 'string', format: 'date-time', example: '2026-12-25T15:30:00.000Z' },
                        valor_total: { type: 'string', example: '9000.00' },
                        atendido: { type: 'integer', example: 0 },
                        medico_apellido: { type: 'string', example: 'Benitez' },
                        medico_nombres: { type: 'string', example: 'Horacio' },
                        paciente_apellido: { type: 'string', example: 'Hunk' },
                        paciente_nombres: { type: 'string', example: 'Lorena' },
                        especialidad: { type: 'string', example: 'TRAUMATOLOGIA' },
                        obra_social: { type: 'string', example: 'OSUNER' }
                    }
                },
                TurnoSimple: {
                    type: 'object',
                    properties: {
                        id_turno_reserva: { type: 'integer', example: 1 },
                        fecha_hora: { type: 'string', format: 'date-time', example: '2026-12-25T15:30:00.000Z' },
                        valor_total: { type: 'number', example: 9000 },
                        atendido: { type: 'integer', example: 0 }
                    }
                },
                Especialidad: {
                    type: 'object',
                    properties: {
                        id_especialidad: { type: 'integer', example: 1 },
                        nombre: { type: 'string', example: 'TRAUMATOLOGIA' }
                    }
                },
                Medico: {
                    type: 'object',
                    properties: {
                        id_medico: { type: 'integer', example: 1 },
                        id_usuario: { type: 'integer', example: 1 },
                        apellido: { type: 'string', example: 'Lopez' },
                        nombres: { type: 'string', example: 'Marcelo' },
                        email: { type: 'string', example: 'lopmar@correo.com' },
                        foto_path: { type: 'string', example: '' }
                    }
                },
                ObraSocial: {
                    type: 'object',
                    properties: {
                        id_obra_social: { type: 'integer', example: 2 },
                        nombre: { type: 'string', example: 'OSUNER' },
                        descripcion: { type: 'string', example: 'Obra social de la universidad' },
                        porcentaje_descuento: { type: 'number', example: 40.00 },
                        es_particular: { type: 'boolean', example: false },
                        activo: { type: 'integer', example: 1 }
                    }
                },
                Paciente: {
                    type: 'object',
                    properties: {
                        id_paciente: { type: 'integer', example: 2 },
                        id_usuario: { type: 'integer', example: 8 },
                        apellido: { type: 'string', example: 'Hunk' },
                        nombres: { type: 'string', example: 'Lorena' },
                        email: { type: 'string', example: 'lorena.hunk@ejemplo.com' },
                        foto_path: { type: 'string', example: '/uploads/pacientes/hunk.jpg' },
                        id_obra_social: { type: 'integer', example: 2 }
                    }
                },
                EstadisticaGeneral: {
                    type: 'object',
                    properties: {
                        total_turnos: { type: 'integer', example: 6 },
                        total_atendidos: { type: 'integer', example: 1 },
                        total_pendientes: { type: 'integer', example: 5 },
                        monto_total: { type: 'number', example: 175500.00 },
                        promedio_consulta: { type: 'number', example: 29250.00 }
                    }
                },
                EstadisticaMedico: {
                    type: 'object',
                    properties: {
                        id_medico: { type: 'integer', example: 3 },
                        apellido: { type: 'string', example: 'Benitez' },
                        nombres: { type: 'string', example: 'Horacio' },
                        total_atenciones: { type: 'integer', example: 3 },
                        atendidos: { type: 'integer', example: 0 },
                        monto_generado: { type: 'number', example: 27000.00 }
                    }
                },
                EstadisticaObraSocial: {
                    type: 'object',
                    properties: {
                        id_obra_social: { type: 'integer', example: 2 },
                        nombre: { type: 'string', example: 'OSUNER' },
                        total_turnos: { type: 'integer', example: 3 },
                        monto_total: { type: 'number', example: 27000.00 },
                        promedio: { type: 'number', example: 9000.00 }
                    }
                },
                CrearUsuario: {
                    type: 'object',
                    // Todos los campos obligatorios aquí:
                    required: ['documento', 'apellido', 'nombres', 'email', 'contrasenia', 'rol'],
                    properties: {
                        // Obligatorios
                        documento: { type: 'string', example: '12345678' },
                        apellido: { type: 'string', example: 'Perez' },
                        nombres: { type: 'string', example: 'Juan' },
                        email: { type: 'string', example: 'juan.perez@ejemplo.com' },
                        contrasenia: { type: 'string', format: 'password', example: 'Password123' },
                        rol: { type: 'string', enum: ['admin', 'medico', 'paciente'], example: 'paciente' },

                        // Opcionales (no están en el array 'required')
                        id_especialidad: { type: 'integer', example: 5 },
                        matricula: { type: 'string', example: 'MAT-98765' },
                        descripcion: { type: 'string', example: 'Especialista en traumatología' },
                        valor_consulta: { type: 'number', example: 5000.50 },
                        id_obra_social: { type: 'integer', example: 2 }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./src/rutas/v1/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('📚 Documentación Swagger disponible en http://localhost:3000/api-docs');
};
