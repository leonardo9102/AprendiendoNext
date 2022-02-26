export default function validarCrearCuenta(valores){
    const errores = {};   

    //Validar el nombre del usuario
    if(!valores.nombre){
        errores.nombre = 'El Nombre es obligatorio';
    }

    //Validar email
    if(!valores.email){
        errores.email ='El email es obligatorio'
    }else if( !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email)){
        errores.email = 'Email no valido';
    }
    //Validar password
    if(!valores.password){
        errores.password = 'El password es obligatorio';
    }else if(valores.password.length < 6){
        errores.password = 'El password debe tener minimo 6 caracteres';
    }   

    return errores;
}