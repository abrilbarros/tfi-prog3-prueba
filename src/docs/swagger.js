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
                        porcentaje_descuento: { type: 'number', example: 40.00 }
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

                //SCHEMAS PARA USUARIOS//
                CrearUsuario: {
                    type: 'object',
                    required: ['documento', 'apellido', 'nombres', 'email', 'contrasenia', 'rol'],
                    properties: {
                        documento: { type: 'string', example: '12345678' },
                        apellido: { type: 'string', example: 'Perez' },
                        nombres: { type: 'string', example: 'Juan' },
                        email: { type: 'string', example: 'juan.perez@ejemplo.com' },
                        contrasenia: { type: 'string', format: 'password', example: 'Password123' },
                        rol: { type: 'integer', enum: [1, 2, 3], example: 1, description: '1(Medico) | 2(Paciente) | 3(Admin)' },
                        //Datos medicos
                        id_especialidad: { type: 'integer', example: 1, description: 'Obligatorio si el rol es 1(Medico). Enviar vacio para otros' },
                        matricula: { type: 'integer', example: 1234, description: 'Obligatorio si el rol es 1(Medico). Enviar vacio para otros' },
                        descripcion: { type: 'string', example: "Especialista en Cardiologia", description: 'Obligatorio si el rol es 1(Medico). Enviar vacio para otros' },
                        valor_consulta: { type: 'integer', example: 8000, description: 'Obligatorio si el rol es 1(Medico). Enviar vacio para otros' },
                        //Datos pacientes
                        id_obra_social: { type: 'integer', example: 1, description: 'Obligatorio si el rol es 2(Paciente). Enviar vacio para otros' }
                    }
                },
                ModificarUsuario: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', example: 'juan.perez@ejemplo.com' },
                        //Datos medicos
                        id_especialidad: { type: 'integer', example: 1 },
                        descripcion: { type: 'string', example: "Especialista en Cardiologia" },
                        valor_consulta: { type: 'integer', example: 8000 },
                        //Datos pacientes
                        id_obra_social: { type: 'integer', example: 1 }
                    }
                },
                RespuestaListaAdmins: {
                    type: 'object',
                    properties: {
                        estado: { type: 'boolean', example: true },
                        datos: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id_usuario: { type: 'integer', example: 8 },
                                    documento: { type: 'string', example: '51000111' },
                                    apellido: { type: 'string', example: 'Fernandez' },
                                    nombres: { type: 'string', example: 'Benito' },
                                    email: { type: 'string', example: 'ferben@correo.com' }
                                }
                            }
                        }
                    }
                },
                RespuestaCreacionUsuario: {
                    type: 'object',
                    properties: {
                        estado: { type: 'boolean', example: true },
                        mensaje: { type: 'string', example: 'Usuario creado con el ID 63.' },
                        datos: { type: 'integer', example: 63 }
                    }
                },
                RespuestaCambioContrasenia: {
                    type: 'object',
                    properties: {
                        estado: { type: 'boolean', example: true },
                        mensaje: { type: 'string', example: 'Contraseña modificada con exito.' },
                        datos: { type: 'integer', example: 10 }
                    }
                },
                RespuestaModificacion: {
                    type: 'object',
                    properties: {
                        estado: { type: 'boolean', example: true },
                        mensaje: { type: 'string', example: 'Usuario modificado con exito.' },
                        datos: {
                            type: 'object',
                            properties: {
                                id_usuario: { type: 'integer', example: 1 },
                                documento: { type: 'string', example: '31000111' },
                                apellido: { type: 'string', example: 'Lopez' },
                                nombres: { type: 'string', example: 'Marcelo' },
                                email: { type: 'string', example: 'lopmar@correo.com' },
                                contrasenia: { type: 'string', example: '2a2646782c5...' },
                                foto_path: { type: 'string', example: '' },
                                rol: { type: 'integer', example: 1 },
                                activo: { type: 'integer', example: 1 }
                            }
                        }
                    }
                },
                RespuestaEliminacion: {
                    type: 'object',
                    properties: {
                        estado: { type: 'boolean', example: true },
                        mensaje: { type: 'string', example: 'Usuario con ID 10 eliminado con exito.' }
                    }
                },
                //Schema para errores del tipo 400
                RespuestaErrorGenerico: {
                    type: 'object',
                    properties: {
                        estado: { type: 'boolean', example: false },
                        mensaje: { type: 'string', example: 'Error genérico.' }
                    }
                },
                //Schema para errores del tipo 500
                RespuestaErrorInterno: {
                    type: 'object',
                    properties: {
                        estado: { type: 'boolean', example: false },
                        mensaje: { type: 'string', example: 'Error interno.' }
                    }
                },

                CambiarContrasenia: {
                    type: 'object',
                    required: ['contraseniaActual', 'nuevaContrasenia', 'repetirContrasenia'],
                    properties: {
                        contraseniaActual: { type: 'string', format: 'password'},
                        nuevaContrasenia: { type: 'string', format: 'password'},
                        repetirContrasenia: { type: 'string', format: 'password'}
                    }
                },

                ReiniciarContrasenia: {
                    type: 'object',
                    required: ['token', 'documento', 'nuevaContrasenia', 'repetirContrasenia'],
                    properties: {
                        token: { type: 'string', format: 'token'},
                        documento: { type: 'integer'},
                        nuevaContrasenia: { type: 'string', format: 'password'},
                        repetirContrasenia: { type: 'string', format: 'password'}
                    }
                },

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
