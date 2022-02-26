import React,{useState, useContext,useEffect} from 'react';
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario';
import Router,{useRouter}from 'next/router';
import firebase from '../firebase';
import { FirebaseContext } from '../firebase';
import { css } from '@emotion/react';
import FileUploader from 'react-firebase-file-uploader';

//Validaciones
import useValidacio from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';

import Error44 from '../components/layout/404';

const STATE_INICIAL = {
    nombre: '',
    empresa: '',
    imagen:'',
    url: '',
    descripcion: ''
}
const NuevoProducto = () => {

    //state de las imagenes
    const[errorArchivo, guardarErrorArchivo] = useState('');    
    const[urlimagen, guardarUrlImagen]=useState('');
    


    const [erroresFirebase, guardarErroresFirebase] = useState('');
   
    const {valores,errores,hadleSubmit,handleChange,handleBlur} = useValidacio
    (STATE_INICIAL,validarCrearProducto,crearProducto);

    const { nombre,empresa,imagen,url,descripcion} = valores;

    // hook de routing para redireccionear
    const router = useRouter();

    // context con las operacions rud de firebase
    const {usuario, firebase} = useContext(FirebaseContext);
    
    useEffect(() =>{
        //si cierran sesion
        if(!usuario){            
            return Router.push('/login');            
        }
    },[usuario]);    
    
    async function crearProducto (){        
          
        // crear el objeto de nuevo producto
        const producto = {
            nombre,
            empresa,
            url,
            urlimagen,
            descripcion,
            votos:0,
            comentarios: [],
            creado: Date.now(),
            creador:{
                id:usuario.uid,
                nombre:usuario.displayName
            },
            haVotado:[]
        }
    
        // insertando en la base dee datos
        const creandoProducto = await firebase.nuevaBd(producto);
        if(creandoProducto === 'Producto creado con exito'){
            return Router.push('/'); 
        };
    }    
  
    async function retornoFirebase (evento,usuario){    
        const respuestaFirebase = await firebase.subirImagen(evento,usuario);        
        
        
        if(typeof respuestaFirebase === 'string'){
            
            if(respuestaFirebase === 'Formato inválido, el archivo debe ser una imagen'){
                guardarErrorArchivo(respuestaFirebase);
                    setTimeout(()=>{
                    guardarErrorArchivo('')
                },3000);
                
            }else{                
                guardarUrlImagen(respuestaFirebase);                
            }            
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
                    >Nuevo Producto</h1>
                    {erroresFirebase ?<Error>{erroresFirebase}</Error>:null}
                    <Formulario
                        onSubmit={hadleSubmit}
                    >
                        <fieldset>
                            <legend>Información General</legend>
                        
                            <Campo>
                                <label htmlFor="nombre">Nombre</label>
                                <input 
                                    type="text"
                                    id='nombre'
                                    placeholder='Nombre del producto'
                                    name='nombre'
                                    value={nombre}
                                    onChange={handleChange}
                                    onBlur={handleBlur}

                                />
                            </Campo>
                            {errores.nombre && <Error>{errores.nombre}</Error>}
                            <Campo>
                                <label htmlFor="empresa">Empresa</label>
                                <input 
                                    type="text"
                                    id='empresa'
                                    placeholder='Nombre de empresa o Compañia'
                                    name='empresa'
                                    value={empresa}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Campo>
                            {errores.empresa && <Error>{errores.empresa}</Error>}
                            
                            <Campo>
                                <label htmlFor="imagen">Imagen1</label>
                                <input
                                    type='file'
                                    accept='image/*'
                                    id='imagen'
                                    name='imagen'
                                    onChange={(event)=>retornoFirebase((event),usuario)}                                
                                    
                                />
                            </Campo>
                            {errorArchivo && <Error>{errorArchivo}</Error>}
                            
                            
                            <Campo>
                                <label htmlFor="url">Url</label>
                                <input 
                                    type="url"
                                    id='url'
                                    name='url'
                                    placeholder='URL de tu producto'
                                    value={url}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Campo>
                            {errores.url && <Error>{errores.url}</Error>}

                        </fieldset>

                        <fieldset>
                            <legend>Sobree tu Producto</legend>
                            <Campo>
                                <label htmlFor="descripcion">Descripcion</label>
                                <textarea                                    
                                    id='descripcion'
                                    name='descripcion'
                                    value={descripcion}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Campo>
                            {errores.descripcion && <Error>{errores.descripcion}</Error>}
                        </fieldset>
                        <InputSubmit 
                            type="submit"
                            value="Crear Producto"
                        />
                    </Formulario>
                </>
            </Layout>
        </div>
    );
}
 
export default NuevoProducto; 
