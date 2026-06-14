import UsuariosServicio from "../servicios/usuariosServicios.js";

export default class UsuariosControlador {
    constructor() {
        this.usuariosServicio = new UsuariosServicio();
    }

    listarAdmins = async (req, res) => {
        try {
            const administradores = await this.usuariosServicio.listarAdmins();

            if (administradores.length === 0) {
                return res.status(404).json({
                    estado: false,
                    mensaje: "No se encontraron administradores."
                });
            }

            res.status(200).json({
                estado: true,
                datos : administradores
            });

        } catch (error) {
            console.log(`Error en GET /admins ${error}`);

            res.status(500).json({
                estado: false,
                mensaje: "Error interno."
            });
        }
    }

    crear = async (req, res) => {
        try {
            
            const nuevoUsuario = req.dto
            const idUsuario = await this.usuariosServicio.crear(nuevoUsuario);

            return res.status(201).json({
                estado: true,
                mensaje: `Usuario creado con el ID ${idUsuario}.`,
                datos: idUsuario
            });

        } catch(error){
            if(error.message.includes("Duplicate entry")){
                return res.status(400).json({
                    estado: false, 
                    mensaje: "Uno de los datos ingresados ya se encuentra registrado."
                });
            }
            return res.status(500).json({
                estado: false,
                mensaje: 'Error interno.'
            });
        }
    }

    modificar = async (req, res) => {
        try {
            const datos = req.dto
            const idUsuario = req.params.id_usuario

            const usuarioModificado = await this.usuariosServicio.modificar(idUsuario, datos);

            return res.status(200).json({
                estado: true,
                mensaje: `Usuario modificado con exito.`,
                datos: usuarioModificado
            });
        } catch (error) {
            if (error.message === "INEXISTENTE") {
                return res.status(404).json({
                    estado: false,
                    mensaje: "El usuario no existe." })
            };
            if (error.message === "EMPTY_DATA") {
                return res.status(400).json({
                    estado: false,
                    mensaje: "No se enviaron datos para actualizar." })
            };
            res.status(500).json(
                {
                    'estado': false, 
                    'mensaje': 'Error interno.'
                }
            );
        }
    }

    eliminar = async(req, res) => {
        try{
            const id_usuario = req.params.id_usuario;
            const respuesta = await this.usuariosServicio.eliminar(id_usuario);

            if(respuesta === null){
                return res.status(404).json({
                    estado: false, 
                    mensaje: 'Usuario no encontrado.'
                });
            }
            
            return res.status(200).json({
                estado: true,
                mensaje: `Usuario con ID ${id_usuario} eliminado con exito.`,
            });

        }catch (error) {
            console.error(error);
            res.status(500).json(
                {
                    'estado': false, 
                    'mensaje': 'Error interno.'
                }
            );
        }
    }
}