import Usuarios from "../db/usuarios.js"
import CrearUsuarioDTO from "../dtos/usuariosCrearDTO.js";
import ModificarUsuarioDTO, { esDtoVacio } from "../dtos/usuariosModificarDTO.js";
import { pool } from "../db/conexion.js";
import crypto from 'crypto'
export default class UsuariosServicios {
    constructor() {
        this.usuarios = new Usuarios();
    }

    listarAdmins = async () => {
        return await this.usuarios.listarAdmins();
    }

    buscarPorId = async (id_usuario) => {
        return await this.usuarios.buscarPorId(id_usuario);
    }
    
    buscar = async (email, contrasenia) => {
        return await this.usuarios.buscar(email, contrasenia);
    }

    buscarPorEmail = async (email) => {
        return await this.usuarios.buscarPorEmail(email);
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
        
        if (esDtoVacio(datos)) {
            throw new Error("EMPTY_DATA")
        };
        
        const usuario = await this.usuarios.buscarPorId(id_usuario);
        if(!usuario) {
            throw new Error("INEXISTENTE");
        }
        
        const conexion = await pool.getConnection();
        try {
            await conexion.beginTransaction();

            const dto = new ModificarUsuarioDTO(datos);

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

            const usuarioModificado = await this.usuarios.buscarPorId(id_usuario);

            return usuarioModificado;
        } catch (error) {
            console.log(error)
            await conexion.rollback();
            await conexion.release();
            throw error;
        }
    }

    cambiarContrasenia = async (id_usuario, data) => {
        
        const usuario = await this.usuarios.buscarPorId(id_usuario);
        if(!usuario) throw new Error("NO_EXISTE");

        const contraseniaHashActual = crypto.createHash('sha256').update(data.contraseniaActual).digest('hex');

        if(usuario.contrasenia !== contraseniaHashActual) {
            throw new Error("CONT_INCORRECTA");
        }
        if(data.nuevaContrasenia !== data.repetirContrasenia){
            throw new Error("NO_COINCIDEN");
        }

        const nuevaContraseniaHash = crypto.createHash('sha256').update(data.nuevaContrasenia).digest('hex');

        return await this.usuarios.cambiarContrasenia(id_usuario, nuevaContraseniaHash)
    }

    reinicioContrasenia = async (id_usuario, contrasenia) => {

        const usuario = await this.usuarios.buscarPorId(id_usuario);
        if(!usuario) throw new Error("NO_EXISTE");

        const contraseniaHasheada = crypto.createHash('sha256').update(contrasenia).digest('hex');

        return await this.usuarios.cambiarContrasenia(id_usuario, contraseniaHasheada)
    }

    eliminar = async (id_usuario) => {
        
        const existe = await this.usuarios.buscarPorId(id_usuario);
        
        if(existe === undefined){
            return null;
        };

        return await this.usuarios.eliminar(id_usuario);
    }
}