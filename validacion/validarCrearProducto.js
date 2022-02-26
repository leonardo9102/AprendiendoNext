export default function validarCrearProducto(valores){
    const errores = {};   

    //Validar el nombre del usuario
    if(!valores.nombre){
        errores.nombre = 'El Nombre es obligatorio';
    }
    //Validar la empresa del producto
    if(!valores.empresa){
        errores.empresa = 'El Nombre de la empresa es obligatorio';
    }    
    //Validar la URL
    if(!valores.url){
        errores.url = ' la URL del producto es obligatorio';
    }else if ( !/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)){
        errores.url = "URL mal formateada o no validada"
    }

    // validar descripcio
    if(!valores.descripcion){
        errores.descripcion = 'Agrega una descripcion a tu producto';
    }

   

    return errores;
}