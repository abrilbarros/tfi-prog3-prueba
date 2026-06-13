export default class EspecialidadesCrearDTO {

    constructor(objeto) {
        this.nombre = objeto.nombre.trim().toUpperCase();
    }

}
