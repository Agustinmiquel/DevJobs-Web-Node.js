document.addEventListener('DOMContentLoaded', ()=> {
    const skills = document.querySelector('.lista-conocimientos'); 

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

    document.querySelector('#skills').value = skills;
}