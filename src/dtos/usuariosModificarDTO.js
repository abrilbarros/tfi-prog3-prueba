export default class ModificarUsuarioDTO {

    constructor(objeto) {

        this.usuario = {
            email: objeto.email
        };

        this.medico = {
            descripcion: objeto.descripcion,
            valor_consulta: objeto.valor_consulta,
            id_especialidad: objeto.id_especialidad
        };

        this.paciente = {
            id_obra_social: objeto.id_obra_social
        };
    }
}