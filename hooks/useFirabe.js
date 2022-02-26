import React,{useState} from 'react';

const useFirebase = () => {
    //error de cargar un archivo que no es una imagen
    const [errorImagen, guardarErrorImagen] = useState('');

    const funcionError = texto =>{
        guardarErrorImagen(texto);
    }
    if(errorImagen){
        console.log(errorImagen);
    }
    return {
        errorImagen,
        funcionError
    };
}
 
export default useFirebase;