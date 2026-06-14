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

export const esDtoVacio = (dto) => {
    // Obtenemos todos los valores del objeto y verificamos si todos son null
    const valores = Object.values(dto);
    return valores.every(valor => valor === null);
};