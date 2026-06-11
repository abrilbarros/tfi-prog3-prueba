import Usuarios from "../db/usuarios.js"
import CrearUsuarioDTO from "../dtos/usuariosCrearDTO.js";
import ModificarUsuarioDTO from "../dtos/usuariosModificarDTO.js";
import { pool } from "../db/conexion.js";

export default class UsuariosServicios {
    constructor() {
        this.usuarios = new Usuarios();
    }

    listarAdmins = async () => {
        return await this.usuarios.listarAdmins();
    }

    buscarPorId = (id_usuario) => {
    return this.usuarios.buscarPorId(id_usuario);
    }
    
    buscar = (email, contrasenia) => {
        return this.usuarios.buscar(email, contrasenia);
    }

    crear = async (nuevoUsuario) => {
        
        const conexion = await pool.getConnection();

        try {

            await conexion.beginTransaction();

            const dto = new CrearUsuarioDTO(nuevoUsuario);

            const idUsuario = await this.usuarios.crearUsuario(dto.usuario, conexion);

            if (dto.usuario.rol === 1) {
                await this.usuarios.crearMedico(idUsuario, dto.medico, conexion);
            }

            else if (dto.usuario.rol === 2) {
                await this.usuarios.crearPaciente(idUsuario, dto.paciente, conexion);
            }

            await conexion.commit();
            await conexion.release();

            return idUsuario;
        }catch(error) {
            console.log(error)
            await conexion.rollback();
            await conexion.release();
            throw error;
        }
    }

    modificar = async (id_usuario, datos) => {
        
        const conexion = await pool.getConnection();

        try {
            
            await conexion.beginTransaction();

            const dto = new ModificarUsuarioDTO(datos);
            
            const usuario = await this.usuarios.buscarPorId(id_usuario);

            if(!usuario) {
                throw new Error("Usuario no encontrado");
            }

            if(usuario.rol == 1) {
                await this.usuarios.modificarMedico(id_usuario, dto.medico, conexion);
                await this.usuarios.modificarUsuario(id_usuario, dto.usuario , conexion);
            }
            else if(usuario.rol == 2) {
                await this.usuarios.modificarPaciente(id_usuario, dto.paciente, conexion);
                await this.usuarios.modificarUsuario(id_usuario, dto.usuario, conexion);
            }
            else { await this.usuarios.modificarUsuario(id_usuario, dto.usuario, conexion) }

            await conexion.commit();
            await conexion.release();

            const usuarioModificado = this.usuarios.buscarPorId(id_usuario);

            return usuarioModificado;
        } catch (error) {
            console.log(error)
            await conexion.rollback();
            await conexion.release();
            throw error;
        }
    }

    eliminar = async (id_usuario) => {
        
        const usuario = await this.usuarios.buscarPorId(id_usuario);

            if(!usuario) {
                throw new Error("Usuario no encontrado");
            }
        
        return await this.usuarios.eliminar(id_usuario);
    }
}