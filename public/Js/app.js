import axios from "axios";
import Swal from "sweetalert2";

document.addEventListener('DOMContentLoaded', ()=> {
    const skills = document.querySelector('.lista-conocimientos'); 

    let alertas = document.querySelector(".alertas")

    if(alertas){
        limpiarAlertas()
    }

    if(skills){
        skills.addEventListener('click', agregarSkills); 
    }

    const vacante = document.querySelector('.panel-administracion')
    if (vacante) {
        vacante.addEventListener("click", accionesListado)
    }
})

const skills = new Set();
const agregarSkills = e =>{
    if(e.target.tagName === 'LI'){
        if(e.target.classList.contains('activo')){
            //quitarlo de la clase
            skills.delete(e.target.textContent);
            e.target.classList.remove('activo')
        } else{
            //agregarlo al set y a la clase
            skills.add(e.target.textContent);
            e.target.classList.add('activo')
        }
    }

    // En este array se van a tomar como valor, los skills guardados.Es impor pasarlos como valor al value.
    const skillsArray = [...skills]
    document.querySelector('#skills').value = skillsArray;
}

const limpiarAlertas= () => {
    const alertas = document.querySelector(".alertas")
    const interval = setInterval(()=>{
        if(alertas.children.length > 0){
            alertas.removeChild(alertas.children[0]);
        } else if (alertas.children.length === 0) {
            alertas.parentElement.removeChild(alertas);
            clearInterval(interval)
        }
    }, 2000); 
}

// Eliminar vacantes: 
const accionesListado = e => {

    e.preventDefault();

    if(e.target.dataset.eliminar){
        // eliminar con axios

        Swal.fire({
            title: 'Estas seguro de eliminar la vacante?',
            text: "Una vez eliminado, no se va a poder recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#00C897',
            cancelButtonColor: '#C80045',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.value) {
                // enviar peticion con axios:
                const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;
                // axios para eliminar el registro:
                axios.delete(url, {params: {url}})
                .then(function(respuesta){
                    if (respuesta.status === 200){
                        Swal.fire(
                            'Se eliminó',
                            respuesta.data,
                            'success'
                          );

                        // todo eliminar del DOM
                            e.target.parentElement.parentElement.parentElement.removeChild
                            (e.target.parentElement.parentElement)
                    }
                });
              
            }
          })
     } else {
            window.location.href= e.target.href
     }
}