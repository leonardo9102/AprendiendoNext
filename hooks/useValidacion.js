    import React,{useState,useEffect} from 'react';
    

    const useValidacio = (stateeInicial, validar, fn) => {

        const [valores, guardarValores] = useState(stateeInicial);
        const [errores, guardarErrores] = useState({});
        const [ submitForm, guardarSubmitForm] = useState(false);
        

        useEffect(() => {
            
            if(submitForm){
                const noErrores = Object.keys(errores).length === 0;                   
                if(noErrores){
                    fn(); //Fn = funcio que e ejecuta e el componente
                }
                guardarSubmitForm(false);
            }
        }, [errores]);

        // Función que se ejecuta conforme el uuario escribe algo
        const handleChange = e =>{
            guardarValores({
                ...valores,
                [e.target.name]: e.target.value
            })
        }

        //Funcio que se ejecuta cuado el uuario hace submit
        const hadleSubmit = e =>{
            e.preventDefault();            
            const erroresValidacion1 = validar(valores);            
            guardarErrores(erroresValidacion1);
            guardarSubmitForm(true);                     
        }

        // cuando se realiza el evento de blur
        const handleBlur = ()=>{
            const erroresValidacion = validar(valores);            
            guardarErrores(erroresValidacion);
        }    
        
        return {
            valores,
            errores,
            submitForm,            
            handleChange,
            hadleSubmit,
            handleBlur,
            
        };
    }
     

    export default useValidacio;