import React,{useState} from 'react';
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario';
import Router from 'next/router';
import firebase from '../firebase';
import { css } from '@emotion/react';

//Validaciones
import useValidacio from '../hooks/useValidacion';
import validarCrearCuenta from '../validacion/validarCrearCuenta';
import useFirebase from '../hooks/useFirabe';

const STATE_INICIAL = {
    nombre: '',
    email: '',
    password:''
}
const CrearCuenta = () => {   
    
    const [erroresFirebase, guardarErroresFirebase] = useState('');
   
    const {valores,errores,hadleSubmit,handleChange,handleBlur} = useValidacio
    (STATE_INICIAL,validarCrearCuenta,crearCuenta);

    const {funcionError} = useFirebase();

    const { nombre,email,password} = valores;

    async function crearCuenta (){
        try{            
            const usuarioRegistrando = await firebase.registar(nombre, email, password);
            if(typeof usuarioRegistrando === 'string'){
                guardarErroresFirebase(usuarioRegistrando);
                return;
            }                     
            Router.push('/');
        }catch(error){
            console.log('Hubo un error al crear el usuario', error.message);
            
        }
    }
    if(errores.firebase){
        console.log(errores.firebase);
    }

    return (  
        <div>
            <Layout>
                <>                    
                    <h1
                        css={css`
                            text-align:center;
                            margin-top:5rem;
                        `}
                    >Crear cuenta</h1>
                    {erroresFirebase ?<Error>{erroresFirebase}</Error>:null}
                    <Formulario
                        onSubmit={hadleSubmit}
                    >
                        <Campo>
                            <label htmlFor="nombre">Nombre</label>
                            <input 
                                type="text"
                                id='nombre'
                                placeholder='Tu nombre'
                                name='nombre'
                                value={nombre}
                                onChange={handleChange}
                                onBlur={handleBlur}

                            />
                        </Campo>
                        {errores.nombre && <Error>{errores.nombre}</Error>}
                        <Campo>
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email"
                                id='email'
                                placeholder='Tu email'
                                name='email'
                                value={email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>
                        {errores.email && <Error>{errores.email}</Error>}
                        <Campo>
                            <label htmlFor="password">Password</label>
                            <input 
                                type="password"
                                id='password'
                                placeholder='password'
                                name='password'
                                value={password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>
                        {errores.password && <Error>{errores.password}</Error>}
                        <InputSubmit 
                            type="submit"
                            value="Crear Cuenta"
                        />
                    </Formulario>
                </>
            </Layout>
        </div>
    );
}
 
export default CrearCuenta;