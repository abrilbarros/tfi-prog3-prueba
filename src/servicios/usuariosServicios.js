import Usuarios from "../db/usuarios.js"
import CrearUsuarioDTO from "../dtos/crearUsuarioDTO.js";

export default class UsuariosServicios {
    constructor() {
        this.usuarios = new Usuarios();
    }

    crear = async (body) => {

        const dto = new CrearUsuarioDTO(body);

        const idUsuario = await this.usuario.crearUsuario(dto.usuario);

        if (dto.usuario.rol === 1) {
            await this.usuarios.crearMedico(idUsuario, dto.medico);
        }

        else if (dto.usuario.rol === 2) {
            await this.usuarios.crearPaciente(idUsuario, dto.paciente);
        }

        return idUsuario;
    }

    buscarPorId = (id_usuario) => {
        return this.usuarios.buscarPorId(id_usuario);
    }

    buscar = (email, contrasenia) => {
        return this.usuarios.buscar(email, contrasenia);
    }
}