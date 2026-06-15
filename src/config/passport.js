import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';

import UsuariosServicios from '../servicios/usuariosServicios.js';

const estrategia = new LocalStrategy( {
    usernameField: 'email',
    passwordField: 'contrasenia'
},
    async (email, contrasenia, done) => {
        try{
            const usuariosServicios = new UsuariosServicios();
            const usuario  = await usuariosServicios.buscar(email, contrasenia);
            if(!usuario){
                return done(null, false, { estado: false, mensaje: 'Login incorrecto!'});
            }
            return done(null, usuario, { estado: true, mensaje: 'Login correcto!'});
        }
        catch(exc){
            done(exc);
        }
    }
)

const validacion = new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
},
    async (jwtPayload, done) => {
        const usuariosServicios = new UsuariosServicios();
        const usuario = await usuariosServicios.buscarPorId(jwtPayload.id_usuario);
        if(!usuario){
            return done(null, false, { mensaje: 'Token incorrecto!.'});
        }
        return done(null, usuario);
    }
)
export { estrategia, validacion};