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
                    mensaje: "No se encontraron administrado."
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
            console.log(`Error en POST /usuarios ${error}`);
            res.status(400).json(
                {
                    'estado': false, 
                    'mensaje': 'Error interno.'
                }
            );
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
            console.error(error);
            res.status(400).json(
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
            const usuario = await this.usuariosServicio.eliminar(id_usuario);
            
            return res.status(200).json({
                estado: true,
                mensaje: `Usuario con ID ${usuario} eliminado con exito.`,
                datos: usuario
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