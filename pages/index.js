import React, {useEffect,useState,useContext} from 'react';
import Layout from '../components/layout/Layout';
import { FirebaseContext } from '../firebase';
import DetallesProducto from '../components/layout/DetallesProducto';

export default function Home() {

  const [productos, guardarProducto] = useState([]);
  const {firebase} = useContext(FirebaseContext);

  useEffect(()=>{
    async function obtenerProductos(){
      const datosProductos = await firebase.obtenerProductos(null,'creado');
      guardarProducto(datosProductos)
    }
    obtenerProductos();
  },[])
  return (
    <div>
      <Layout>
        <div className='listado-producto'>
          <div className='contenedor'>
            <ul className='bg-white'>
              {productos.map(producto=>(
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
  )
}
