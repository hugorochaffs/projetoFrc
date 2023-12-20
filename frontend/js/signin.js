var loc = window.location;
    //var endPoint = wsStart + loc.host + loc.pathname;
var host = loc.host.split(":")[0];
var serverBanco = loc.protocol+ '//' +host + ':8001';


const urlDoServidor = serverBanco + '/login?';


let btn = document.querySelector('.fa-eye')

btn.addEventListener('click', ()=>{
  let inputSenha = document.querySelector('#senha')

  if(inputSenha.getAttribute('type') == 'password'){
    inputSenha.setAttribute('type', 'text')
  } else {
    inputSenha.setAttribute('type', 'password')
  }
})

function entrar(){
  

  let senha = document.querySelector('#senha')
  let senhaLabel = document.querySelector('#senhaLabel')

  let msgError = document.querySelector('#msgError')
  let listaUser = []

  


login(usuario.value,senha.value);



//   if(usuario.value == userValid.user && senha.value == userValid.senha){

//     window.location.href = '../../index.html'

//     let mathRandom = Math.random().toString(16).substr(2)
//     let token = mathRandom + mathRandom

//     localStorage.setItem('token', token)
//     localStorage.setItem('userLogado', JSON.stringify(userValid))
//   } else {
//     userLabel.setAttribute('style', 'color: red')
//     usuario.setAttribute('style', 'border-color: red')
//     senhaLabel.setAttribute('style', 'color: red')
//     senha.setAttribute('style', 'border-color: red')
//     msgError.setAttribute('style', 'display: block')
//     msgError.innerHTML = 'Usuário ou senha incorretos'
//     usuario.focus()
//   }

 }

 function login(nickname, password) {
  const url = urlDoServidor + 'nickname=' + nickname + '&' + 'password=' + password;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Verifica se há usuários na resposta
      if (data.usuarios && data.usuarios.length > 0) {
        data.usuarios.forEach(usuario => {
          const id = usuario[0];
          const userNickname = usuario[1];
          const capacidades = usuario[3];


          window.location.href = 'themes.html?' + 'id=' + id + '&' + 'nickname=' + userNickname + '&' + 'capacidades=' + capacidades;
        });
      } else {
        
        userLabel.setAttribute('style', 'color: red')
        
        senhaLabel.setAttribute('style', 'color: red')
        senha.setAttribute('style', 'border-color: red')
        msgError.setAttribute('style', 'display: block')
        msgError.innerHTML = 'Usuário ou senha incorretos'
        

        // Faça aqui o que deseja fazer em caso de nenhum usuário encontrado
      }
    })
    .catch(error => console.error('Erro ao obter usuários:', error));
}

// Chame a função para obter os usuários