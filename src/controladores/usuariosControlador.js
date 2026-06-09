import UsuariosServicio from "../servicios/usuariosServicios.js";

export default class UsuariosControlador {
    constructor() {
        this.usuariosServicio = new UsuariosServicio();
    }

    crear = async (req, res) => {
        try {

            const idUsuario = await this.usuariosServicio.crear(req.body);

            return res.status(201).json({
                estado: true,
                mensaje: `Usuario creado con el ID ${idUsuario}.`,
                datos: idUsuario
            });

        } catch(error){
            console.log(`Error en POST /usuarios ${error}`);
            res.status(500).json(
                {
                    'estado': false, 
                    'mensaje': 'Error interno.'
                }
            );
        }
    }
}