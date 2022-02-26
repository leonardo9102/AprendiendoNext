import React,{useState} from 'react';
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario';
import Router from 'next/router';
import firebase from '../firebase';
import { css } from '@emotion/react';

//Validaciones
import useValidacio from '../hooks/useValidacion';
import validarIniciarSesion from '../validacion/validarIniciarSesion';
const STATE_INICIAL = {    
    email: '',
    password:''
}
const Login = () => {    
    
    const [errorLogin, guardarErrorLogin] = useState('');    
   
    const {valores,errores,hadleSubmit,handleChange,handleBlur} = useValidacio
    (STATE_INICIAL, validarIniciarSesion,iniciarSesion);

    const {email,password} =valores;

    async function iniciarSesion (){
        try{
            const usuario = await firebase.logear(email,password);           
            if(typeof usuario === 'string'){
                guardarErrorLogin(usuario);
                return;
            }
            Router.push('/');
              
        }catch(error){
            console.log('Hubo un error al crear el usuario', error.message);            
        }
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
                    >Iniciar Sesión</h1>
                    {errorLogin ?<Error>{errorLogin}</Error>:null}
                    <Formulario
                        onSubmit={hadleSubmit}
                    >                        
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
                            value="Iniciar Sesión"
                        />
                    </Formulario>
                </>
            </Layout>
        </div>
    );
}
 
export default Login