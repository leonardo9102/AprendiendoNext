import React, {useState, useContext, useEffect} from 'react';
import Layout from '../components/layout/Layout';
import { useRouter } from 'next/router';
import DetallesProducto from '../components/layout/DetallesProducto';
import { FirebaseContext } from '../firebase';

const Buscar = () => {

    const [productos, guardarProducto] = useState([]);
    const [bandera1, guardarBandera1] = useState(true);
    const [resultado, guardarResultado] = useState([]);

    const router = useRouter();
    const {query:{q}} =router;    
    
    const {firebase} = useContext(FirebaseContext);

    

    useEffect(()=>{
        
        if(bandera1){async function obtenerProductos(){
                const datosProductos = await firebase.obtenerProductos(null,'creado');
                guardarProducto(datosProductos)
            }            
            obtenerProductos();
            guardarBandera1(false);
        }        
        
        const busqueda = q.toLowerCase();
        const filtro = productos.filter(producto =>{
            return(
                producto.nombre.toLowerCase().includes(busqueda) ||
                producto.descripcion.toLowerCase().includes(busqueda)||
                producto.empresa.toLowerCase().includes(busqueda)
            )
        });
        guardarResultado(filtro);
    },[q, productos])    

    console.log(productos);
    return ( 
        <div>
      <Layout>
        <div className='listado-producto'>
          <div className='contenedor'>
            <ul className='bg-white'>
              {resultado.map(producto=>(
                <DetallesProducto
                  key={producto.id}
                  producto={producto}
                />
              ))}
            </ul>
          </div>
        </div>
      </Layout>
   </div>
     );
}
 
export default Buscar