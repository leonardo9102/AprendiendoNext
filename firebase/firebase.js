import { app } from "firebase/app";
import firebaseConfig from "./config";
import { initializeApp } from "firebase/app";
import { getAuth, signOut, updateProfile, createUserWithEmailAndPassword, signInWithEmailAndPassword,
   } from "firebase/auth";
import React, {Component} from "react";

import { getFirestore } from "firebase/firestore"
import { collection, setDoc, query ,getDoc,getDocs, doc,updateDoc,deleteDoc,orderBy} from "firebase/firestore";
import { getStorage, ref, uploadBytes,getDownloadURL} from "firebase/storage";
import uuid from "react-uuid";



class Firebase extends React.Component{  

  constructor(props){  
    super(props);             
    initializeApp(firebaseConfig);  
    
    this.leo = [];
  } 

  //Registrar un usuario
  async registar(nombre,email,password){    

    const auth = getAuth();    
    const registroUsuario = await createUserWithEmailAndPassword(auth,email,password)              
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;            
      return user;   
      //validarCrearCuenta({firebase:''});          
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      return errorMessage;
      //validarCrearCuenta({firebase:'errorMessage'});     
    }); 

    await updateProfile(auth.currentUser, {
      displayName: nombre })    
    
    return (registroUsuario);
  } 

  //Logear un usuario
  async logear(email,password){
    
    const auth1 = getAuth(); 
    const usuario = await signInWithEmailAndPassword(auth1, email, password)
    .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    // ...
    return user
    })
    .catch((error) => {      
      const errorMessage = error.message;
      return errorMessage;
    });

    return (usuario);  
  } 

  //Creando una base de datos
  async nuevaBd(producto){      
    const db = getFirestore();    
    try {
      //await addDoc(collection(db, "productos"), {producto});
      await setDoc(doc(db, "productos", uuid()), producto);
      console.log('creado');
      return 'Producto creado con exito';
    } catch (e) {
      console.error("Error adding document: ", e);
    }    
  }
  // Cierra la sesion del usuario
  async cerrarSesion(){
    console.log('entro en firebase');
    const auth = getAuth();
    await signOut(auth)
  }

  async subirImagen(event, user){    
    
    const usuario =  user.displayName;  
    const fileName = uuid();             
    const file = event.target.files[0],
    pattern = /^image/;

    if (!pattern.test(file.type)) {     
      const error = 'Formato inválido, el archivo debe ser una imagen';  
      return error;     
    }
    const storage = getStorage();

    // Points to the root reference
    const storageRef = ref(storage);

    // Points to 'images'
    const imagesRef = ref(storageRef, usuario);    
    
    const spaceRef = ref(imagesRef, fileName);

    await uploadBytes(spaceRef, file).then((snapshot) => {            
      console.log('Uploaded a blob or file!');
      
    })    
    
   const direccionUrl = getDownloadURL(ref(storage, `${usuario}/${fileName}`))
    .then((url) => {       
        return url;
      });
    
      return direccionUrl;
  }

  async obtenerProductos(id,busquedaPor){
    
    const db = getFirestore(); 
    this.leo = [];
    //------------------PARA CONSULTAR UN SOLO DOCUMENTO--------------------
    if(id){
      const docRef = doc(db, "productos", id);
      const docSnap = await getDoc(docRef);
      if(docSnap.exists()){
        id = null;
        const datosproducto = docSnap.data();
        const idProducto = {id:docSnap.id};        
        const datos = Object.assign(datosproducto, idProducto);        
        return (datos);        
      }else{
        id = null;
        return 'no existe'; 
      }           
    }
    //------------------------------------------------------------------
    //-----------PARA CONSULTAR TODOS LOS DOCUMENTOS--------------------
    //const docRef1 = doc(db, "productos");
    const refe = collection(db, "productos");
    //const querySnapshot = await getDocs(collection(db, "productos"),orderBy("votos"));
    const q = await getDocs(query(refe, orderBy(busquedaPor, "desc")));
    q.forEach((doc) => {      
      this.leo.push ({        
        id: doc.id,
        ...doc.data()
      });
    });     
    return this.leo;
    //-------------------------------------------------------------
  }  
  async actualizarVotos(id, actualizarDatos){
    
    const {accion,Votos,haVotado,comentarios} = actualizarDatos;
    
    const db = getFirestore();     
    const doc1Ref = doc(db,"productos", id);
    if(accion === 1)
      {await updateDoc(doc1Ref, {
        "votos": Votos,
        "haVotado": haVotado
      });
    }else if(accion ===2){    
       
      await updateDoc(doc1Ref, {
        "comentarios": comentarios        
      });
    }   
  }

  //----------------------Eliminar un producto--------------------

  async eliminarProducto(id){
    const db = getFirestore(); 
    const cityRef = doc(db, 'productos', id);
    await deleteDoc(doc(db, 'productos', id));
    const docSnap = await getDoc(cityRef);
    if(docSnap.exists()){                   
      return 'producto no eliminado';        
    }else{      
      return 'producto eliminado'; 
    }  
  }
}  

const firebase = new Firebase();

export default firebase;





  