module.exports= {
    seleccionarSkills : (seleccionadas = [] , opciones) => {
        const skills = ['HTML5', 'CSS3', 'CSSGrid', 'Flexbox', 'JavaScript', 'Java',
        'jQuery', 'Node.Js', 'Angular', 'VueJS', 'ReactJS', 'React Hooks', 'Express', 'Go',
        'Redux', 'Apollo', 'GraphQL', 'TypeScript', 'PHP', 'Laravel', 'Symfony', 'C++',
        'Python', 'Django', 'ORM', 'Sequelize', 'Mongoose', 'SQL', 'MVC', '.NET', 'C#' ];
        
        let html = '';
        skills.forEach(skill=>{
            html+= `
            <li>${skill}</li>
            `;
        });
   
        return opciones.fn().html = html; 

    },

    tipoContrato: (seleccionado, opciones) => {
        return opciones.fn(this).replace(
            new RegExp(`value="${seleccionado}"`), '$& selected="selected"'
        )
    }
}