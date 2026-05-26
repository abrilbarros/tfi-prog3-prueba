import express from "express";
import { check, param } from "express-validator";

import EspecialidadesControlador from "../../controladores/especialidadesControlador.js";
import { validarCampos } from "../../middlewares/validarCampos.js";

const router = express.Router();

const especialidadesControlador = new EspecialidadesControlador();

// GET /
router.get(
    "/",
    especialidadesControlador.buscarTodas
);

// GET /:id_especialidad
router.get(
    "/:id_especialidad",
    [
        param("id_especialidad", "El parámetro debe ser entero").isInt(),
        validarCampos
    ],
    especialidadesControlador.buscarPorId
);

// POST /
router.post(
    "/",
    [
        check("nombre")
            .trim()
            .notEmpty().withMessage("El nombre es obligatorio.")
            .isLength({ max: 120 }).withMessage("El nombre no debe ser mayor a 120 caracteres."),
        validarCampos
    ],
    especialidadesControlador.crear
);

// PUT /:id_especialidad
router.put(
    "/:id_especialidad",
    [
        param("id_especialidad", "El parámetro debe ser entero").isInt(),
        check("nombre")
            .trim()
            .notEmpty().withMessage("El nombre es obligatorio.")
            .isLength({ max: 120 }).withMessage("El nombre no debe ser mayor a 120 caracteres."),
        validarCampos
    ],
    especialidadesControlador.modificar
);

// DELETE /:id_especialidad
router.delete(
    "/:id_especialidad",
    [
        param("id_especialidad", "El parámetro debe ser entero").isInt(),
        validarCampos
    ],
    especialidadesControlador.borrar
);

export { router };