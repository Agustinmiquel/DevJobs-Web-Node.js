document.addEventListener('DOMContentLoaded', ()=> {
    const skills = document.querySelector('.lista-conocimientos'); 

    let alertas = document.querySelector(".alertas")

    if(alertas){
        limpiarAlertas()
    }

    if(skills){
        skills.addEventListener('click', agregarSkills); 
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