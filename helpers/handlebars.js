module.exports= {
    seleccionarSkills : (seleccionadas = [] , opciones) => {
        const skills = ['HTML5', 'CSS3', 'CSSGrid', 'Flexbox', 'JavaScript', 'Java',
        'jQuery', 'Node.Js', 'Angular', 'VueJS', 'ReactJS', 'React Hooks', 'Express', 'Go',
        'Redux', 'Apollo', 'GraphQL', 'TypeScript', 'PHP', 'Laravel', 'Symfony', 'C++',
        'Python', 'Django', 'ORM', 'Sequelize', 'Mongoose', 'SQL', 'MVC', '.NET', 'C#', 'Nest.js', 'Flutter',
        'Dart', 'Ionic', 'Kotlin', 'Spring Boot', 'React Native', 'SqlAlchemy-Pewee','Flask'
    ];
        
        let html = '';
        skills.forEach(skill=>{
            html += `
                <li ${seleccionadas.includes(skill) ? 'class="activo"' : ''}>${skill}</li>
            `;
        });
   
        return opciones.fn().html = html; 

    },

    tipoContrato: (seleccionado, opciones) => {
        return opciones.fn(this).replace(
            new RegExp(`value="${seleccionado}"`), '$& selected="selected"'
        )
    },

    mostrarAlertas: (errores = {}, alertas) => {
        const categoria = Object.keys(errores);

        let html = '';
        if(categoria.length) {
            errores[categoria].forEach(error => {
                html += `<div class="${categoria} alerta">
                ${error}
                </div>`;
            })
        }
        return alertas.fn().html = html;
    }
}