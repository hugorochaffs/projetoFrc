var serverBanco = 'http://localhost:8001';
var urlCad = serverBanco + '/adicionar_usuario';
var urlFetchUsuario = serverBanco + '/obter_usuarios';

const urlFetchThemes = serverBanco + '/getThemes';


const tema_usuario = {};

/**

tema_usuario = {
    1: [usuario1, usuario2, usuario3],
}

 */

function populaTemaUsuario() {
    const url = urlFetchUsuario;
    const usuarios = [];

    fetch(url).then(response => response.json()).then(data => {
        // console.log(data);
        data.usuarios.forEach(user => {
            // console.log(user);

            // usuarios.push(user);
            try {
                const arrayTemas = JSON.parse(user[3]).map(n => parseInt(n));
                console.log(user[1], arrayTemas);

                for(const tema of arrayTemas){
                    if(tema_usuario[tema] === undefined){
                        tema_usuario[tema] = [];
                    }
                    tema_usuario[tema].push(user);
                }
            } catch (error) {
                
            }

            // const divUser = document.createElement('div');
            // divUser.id = user[0];
            // divUser.className = 'user';

            // const label = document.createElement('h1');
            // label.appendChild(document.createTextNode(user[1]));
            // divUser.appendChild(label);

            // divUsers.appendChild(divUser);
        })
    })

}

function fetchUsuariosandPopulaTemas(){
    const url = urlFetchThemes;
    populaTemaUsuario();

    fetch(url).then(response => response.json()).then(data => {
        // console.log(data);
        // const temas = [];
        const divThemes = document.getElementById('themes');
        data.themes.forEach(theme => {
            console.log(theme);
            
            const divtheme = document.createElement('div');
            divtheme.id = theme[0];
            divtheme.className = 'theme';

            const label = document.createElement('h1');
            label.appendChild(document.createTextNode(theme[1]));
            divtheme.appendChild(label);

            divThemes.appendChild(divtheme);

            for(const user of tema_usuario[theme[0]]){
                const divUser = document.createElement('div');
                divUser.id = user[0];
                divUser.className = 'user';
                const labelUser = document.createElement('h3');
                labelUser.appendChild(document.createTextNode(user[1]));
                divUser.appendChild(labelUser);

                divtheme.appendChild(divUser);
            }
            // const users = fetchUsersByThemes(theme)
            
        })
    })
}

// fetchUsers();

fetchUsuariosandPopulaTemas();