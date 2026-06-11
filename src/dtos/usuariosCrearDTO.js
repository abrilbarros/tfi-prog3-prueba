export default class CrearUsuarioDTO {

    constructor(objeto) {

        this.usuario = {
            documento: objeto.documento,
            apellido: objeto.apellido,
            nombres: objeto.nombres,
            email: objeto.email,
            contrasenia: objeto.contrasenia,
            rol: objeto.rol
        };

        this.medico = {
            id_especialidad: objeto.id_especialidad,
            matricula: objeto.matricula,
            descripcion: objeto.descripcion,
            valor_consulta: objeto.valor_consulta
        };

        this.paciente = {
            id_obra_social: objeto.id_obra_social
        };
    }
}