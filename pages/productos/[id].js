import React,{useEffect, useContext, useState} from 'react';
import { useRouter } from 'next/router';
import { FirebaseContext } from '../../firebase';
import Layout from '../../components/layout/Layout'
import Error44 from '../../components/layout/404';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import {es} from 'date-fns/locale';
import {Campo, InputSubmit} from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';
import Router from 'next/router';



const ContenedorProducto = styled.div`
    @media (min-width:768px){
        display:grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;

const CreadorProducto = styled.p`
    padding: .5rem 2rem;
    background-color: #DA551F;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`;

const Producto = () => {

    //state del componente

    const[producto, guardarProducto] = useState({});
    const[error, guardarError] = useState(false);    
    const[comentario, guardarComentario] = useState({});
    const [consultarBD, guardarConsultarBD] = useState(true);
    

    const router = useRouter();
    const {query: {id}} = router;

    //context de firebase
    const {firebase, usuario} = useContext(FirebaseContext);

    useEffect (()=>{
        if(id && consultarBD){
            
            const obtenerProducto = async () =>{
                const productoQuery = await firebase.obtenerProductos(id);
                if(typeof productoQuery === 'object'){
                    guardarProducto(productoQuery); 
                    guardarConsultarBD(false);                    
                }else {
                    guardarError(true);
                    guardarConsultarBD(false); 
                }                
            }
            obtenerProducto();            
        }
    },[id,producto]);
    
    if(Object.keys(producto).length=== 0 && !error) return 'Cargado...';
    
    //Extraemos los datos del producto
    const {comentarios,creado,descripcion, empresa,haVotado,id1, nombre, url, urlimagen,votos,creador} = producto;
    
  
    const votarProducto = async () =>{
        
        if(!usuario){
            return Router.push('/login');
        }
        //verificar si el usuario actual ha votado
        if(haVotado.includes(usuario.uid)) return;        

        //Obtener y sumar un nuevo voto
        const nuevoTotal = votos +1;        

        //guardar el ID del usuario que ha votado
        const nuevoHanVOTADO = [...haVotado,usuario.uid];
        
        //datos para actualizar 
        
        const datosActualizar = { 
            accion: 1,
            Votos:nuevoTotal,
            haVotado:nuevoHanVOTADO,
            comentarios: []           
        };
        //Actualizar en la BD
        await firebase.actualizarVotos(id,datosActualizar);        
        //Actializar el state
        guardarConsultarBD(true);
        
        guardarProducto({
            ...producto,
            votos:nuevoTotal
        })
        
        
    }

    //Funciones para crear comentario

    const comentarioChange = e =>{
        guardarComentario({
            ...comentario,
            [e.target.name]:e.target.value
        })
    }

    //Identifica si el comentario es el creador del producto
    const esCreador = id =>{
        if(creador.id === id){
            return true;
        }
    }


    const agregarComentario = async e =>{
        e.preventDefault();
        if(!usuario){
            return Router.push('/login');
        }
        //Informacion extra al comentario
        
        comentario.usuarioID = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;        
        const nuevosComentarios = comentarios;
        nuevosComentarios.push(comentario);        
        //----------------------pasos para actualizar bd----------

        //datos para actualizar         
        const datosActualizar = { 
            accion: 2,
            Votos:0,
            haVotado:[],
            comentarios: nuevosComentarios           
        };        
        
        //enviando a la base de datos        
        await firebase.actualizarVotos(id, datosActualizar);        
        //------------------------------------------------------------
        guardarConsultarBD(true);
        //Actualizar el state
        guardarProducto({
            ...producto,
            //comentarios: nuevosComentarios
        })
         
    }
   
    // funcion quee revisa que el creador del producto sea el mismo que esta autenticado
    
    const puedeBorrar = () =>{
        if(!usuario) return false;

        if(creador.id === usuario.uid){
            return true
        }
    }

    const eliminarProducto = async () =>{
        if(!usuario) return Router.push('/login');
        if(creador.id !== usuario.uid){
            return Router.push('/');
        }
        const eliminando = await firebase.eliminarProducto(id);
        if(eliminando === 'producto eliminado'){
            return Router.push('/');
        }
    }
    return (
        <Layout>
            <>
                {error ? <Error44/> :(
                    <div className='contenedor'>
                        <h1 css={css`
                            text-align:center;
                            margin-top: 5rem;
                        `}>{nombre}</h1>
                        <ContenedorProducto>
                            <div>
                            <p>Publicado hace: {formatDistanceToNow(new Date(creado),{locale:es})}</p> 
                            <p>Por: {creador.nombre} de {empresa} </p>
    
                                <img  src={urlimagen} />
                                <p>{descripcion}</p>

                                {usuario && (
                                    <>
                                    <h2>Agrega tu comentario</h2>
                                        <form
                                            onSubmit={agregarComentario}
                                        >
                                            <Campo>
                                                <input 
                                                    type='text'
                                                    name='mensaje'  
                                                    onChange={comentarioChange}                                      
                                                />
                                            </Campo>
                                            <InputSubmit 
                                                type='submit'
                                                value='Agregar Comentario'
                                            />
                                        </form>
                                    </>
                                )}
                                <h2
                                    css={css`
                                        margin: 2rem 0;
                                    `} 
                                >Comentarios</h2>                            
                                {comentarios.length === 0 ? 'Aun no hay comentarios':(
                                    <ul>
                                        {comentarios ? (comentarios.map((comentario,i) =>(
                                            <li
                                                key={`${comentario.usuarioID}-${i}`}
                                                css={css`
                                                    border: 1px solid #e1e1e1;
                                                    padding: 2rem;
                                                `}
                                            >
                                                <p>{comentario.mensaje}</p>
                                                <p>Escrito por:
                                                    <span
                                                        css={css`
                                                            font-weight:bold;
                                                        `}
                                                    >
                                                    {' '} {comentario.usuarioNombre}
                                                    </span></p>
                                                {esCreador(comentario.usuarioID) &&
                                                <CreadorProducto>Es creador</CreadorProducto>}
                                            </li>                            
                                        ))):null}
                                    </ul>
                                )}
                                
                            </div>
                            <aside>
                                <Boton
                                    target="_parent"
                                    bgColor="true"
                                    href={url}
                                >Visitar URL</Boton>
                                <p
                                    css={css`
                                        text-align: center;
                                    `}
                                >{votos} Votos</p>
                                {usuario && (
                                    <Boton
                                        onClick={votarProducto}
                                    >
                                        Votar
                                    </Boton>)
                                }
                            </aside>
                        </ContenedorProducto>
                        
                        {puedeBorrar() &&
                            <Boton
                                onClick={eliminarProducto}
                            >Eliminar Producto</Boton>
                        }
                    </div>
                )}                
            </>
        </Layout>       
    )    
}
 
export default Producto;
