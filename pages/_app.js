import App from 'next/app';
import firebase, {FirebaseContext} from '../firebase';
import useAutenticacion from '../hooks/useAutenticacio';

const MyApp = (props) =>{
  const usuario = useAutenticacion();  
  const { Component, pageProps}= props;

  return(
    <FirebaseContext.Provider
      value={{
        firebase,
        usuario: usuario
      }}
    >
      <Component {...pageProps} />
    </FirebaseContext.Provider>
  )
}
export default MyApp
