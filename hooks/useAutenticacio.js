import React, {useEffect, useState} from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth"

function useAutenticacion() {

    const [usuarioAutenticado, guardarUsuarioAutenticado] = useState(null);
    
    useEffect(() =>{
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            guardarUsuarioAutenticado(user);            
        });
       
    },[])
    return usuarioAutenticado;
}
export default useAutenticacion