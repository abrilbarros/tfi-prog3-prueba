import jwt from 'jsonwebtoken';
import passport from 'passport';
import UsuariosServicio from "../servicios/usuariosServicios.js";

export default class AuthController {
    constructor() {
        this.usuariosServicio = new UsuariosServicio();
    }

    login = async (req, res) => {
        passport.authenticate('local', { session: false }, (err, usuario, info) => {
            if (err || !usuario) {
                return res.status(400).json({
                    estado: false,
                    mensaje: "Solicitud incorrecta."
                })
            }
            req.login(usuario, { session: false }, (err) => {
                if (err) {
                    res.send(err);
                }
                const token = jwt.sign(usuario, process.env.JWT_SECRET, { expiresIn: '1h' });

                return res.json({
                    estado: true,
                    token: token
                });
            })
        })(req, res);
    }

    buscarPorEmail = async (req, res) => {

        try {
            const { email } = req.body;

            const usuario = await this.usuariosServicio.buscarPorEmail(email);

            if (!usuario) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Usuario no encontrado'
                });
            }
            const token = jwt.sign(usuario, process.env.JWT_SECRET, { expiresIn: '5m' });

            return res.status(200).json({
                estado: true,
                mensaje: 'Token generado con exito',
                token: token
            });
        } catch (error) {
            console.error("Error en el controlador de olvido de contraseña:", error);
            return res.status(500).json({ estado: false, mensaje: "Error interno." });
        }
    }

    reinicioContrasenia = async (req, res) => {
        const { token, documento, nuevaContrasenia, repetirContrasenia } = req.body;

        try {
            const dataToken = jwt.verify(token, process.env.JWT_SECRET);
            
            if (nuevaContrasenia !== repetirContrasenia) {
                return res.status(400).json({
                    estado: false,
                    mensaje: 'Las contraseñas no coinciden'
                });
            }
            if (dataToken.documento !== documento) {
                return res.status(403).json({
                    estado: false,
                    mensaje: 'Token invalido para este usuario'
                });
            }

            const contraseniaActualizada = await this.usuariosServicio.reinicioContrasenia(dataToken.id_usuario, nuevaContrasenia)

            return res.status(200).json({
                estado: true,
                mensaje: `Contraseña modificada con exito.`,
                datos: contraseniaActualizada
            });

        } catch (error) {
            if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
                return res.status(401).json({ estado: false, mensaje: 'Token inválido o expirado' });
            }
            if (error.message === "NO_EXISTE") {
                return res.status(404).json({
                    estado: false,
                    mensaje: "El usuario no existe."
                })
            };
            res.status(500).json(
                {
                    'estado': false,
                    'mensaje': 'Error interno.'
                }
            );
        }
    }
}