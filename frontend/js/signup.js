var serverBanco = 'http://localhost:8001';
var urlCad = serverBanco + '/adicionar_usuario';
var urlPopulaThemes = serverBanco + '/getThemes';






function fetchDataAndPopulateCheckboxes() {
  const url = urlPopulaThemes;  // Substitua pela URL correta do seu servidor

  fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data);
          const checkboxForm = document.getElementById('checkboxThemes');

          // Cria um checkbox para cada item no array de dados
          
          data.themes.forEach(theme => {

              console.log(theme);

              const checkbox = document.createElement('input');
              checkbox.type = 'checkbox';
              checkbox.name = 'theme';
              checkbox.value = theme[0];

              const label = document.createElement('label');
              label.appendChild(document.createTextNode(theme[1]));

              const listItem = document.createElement('div');
              listItem.appendChild(checkbox);
              listItem.appendChild(label);

              checkboxForm.appendChild(listItem);              
          });
      })

      .catch(error => console.error('Erro ao obter dados:', error));
}

fetchDataAndPopulateCheckboxes();
let btn = document.querySelector('#verSenha')
let btnConfirm = document.querySelector('#verConfirmSenha')


let nome = document.querySelector('#nome')
let labelNome = document.querySelector('#labelNome')
let validNome = false

let usuario = document.querySelector('#usuario')
let labelUsuario = document.querySelector('#labelUsuario')
let validUsuario = false

let senha = document.querySelector('#senha')
let labelSenha = document.querySelector('#labelSenha')
let validSenha = false

let confirmSenha = document.querySelector('#confirmSenha')
let labelConfirmSenha = document.querySelector('#labelConfirmSenha')
let validConfirmSenha = false

let msgError = document.querySelector('#msgError')
let msgSuccess = document.querySelector('#msgSuccess')

nome.addEventListener('keyup', () => {
  if(nome.value.length <= 2){
    labelNome.setAttribute('style', 'color: red')
    labelNome.innerHTML = 'Nickname *Insira no minimo 3 caracteres'
    nome.setAttribute('style', 'border-color: red')
    validNome = false
  } else {
    labelNome.setAttribute('style', 'color: green')
    labelNome.innerHTML = 'Nickname'
    nome.setAttribute('style', 'border-color: green')
    validNome = true
  }
});



senha.addEventListener('keyup', () => {
  if(senha.value.length <= 2){
    labelSenha.setAttribute('style', 'color: red')
    labelSenha.innerHTML = 'Senha *Insira no minimo 3 caracteres'
    senha.setAttribute('style', 'border-color: red')
    validSenha = false
  } else {
    labelSenha.setAttribute('style', 'color: green')
    labelSenha.innerHTML = 'Senha'
    senha.setAttribute('style', 'border-color: green')
    validSenha = true
  }
});

confirmSenha.addEventListener('keyup', () => {
  if(senha.value != confirmSenha.value){
    labelConfirmSenha.setAttribute('style', 'color: red')
    labelConfirmSenha.innerHTML = 'Confirmar Senha *As senhas não conferem'
    confirmSenha.setAttribute('style', 'border-color: red')
    validConfirmSenha = false
  } else {
    labelConfirmSenha.setAttribute('style', 'color: green')
    labelConfirmSenha.innerHTML = 'Confirmar Senha'
    confirmSenha.setAttribute('style', 'border-color: green')
    validConfirmSenha = true
  }
})

function cadastrar(){
  if(validNome  && validSenha && validConfirmSenha){
    let listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]')

  


  
      const formulario = document.getElementById('checkboxThemes');
      const capF = document.getElementById('fCap');
  
      // Obtém todas as checkboxes dentro do formulário
      const checkboxes = formulario.querySelectorAll('input[type="checkbox"]');
  
      // Array para armazenar os valores das checkboxes marcadas
      const checkboxesMarcadas = [];
      const radioMarcadas = [];

    
  
      checkboxes.forEach(checkbox => {
          if (checkbox.checked) {
              checkboxesMarcadas.push(checkbox.value);

          }
      });
  
      const radio = capF.querySelectorAll('input[type="radio"]');
  
      
      // Array para armazenar os valores das checkboxes marcadas
      radio.forEach(rad => {
          if (rad.checked) {
            radioMarcadas.push(rad.value);

          }
      });
      

    
    function criarObjetoJSON(nickname, password) {
      var objetoJSON = {
          "nickname": nickname,
          "password": password,
          "themes": JSON.stringify(checkboxesMarcadas),
          "capacidades": radioMarcadas[0]
      };
  
      // Converte o objeto para uma string JSON
      var jsonString = JSON.stringify(objetoJSON);
  
      return jsonString;
  }

  var dadosParaEnviar = criarObjetoJSON(nome.value,senha.value);

  console.log(dadosParaEnviar);

  enviarDadosPOST(urlCad, dadosParaEnviar);

  

    msgSuccess.setAttribute('style', 'display: block')
    msgSuccess.innerHTML = '<strong>Cadastrando usuário...</strong>'
    msgError.setAttribute('style', 'display: none')
    msgError.innerHTML = ''

    setTimeout(()=>{
         window.location.href = '../html/signin.html'
     }, 3000)


  } else {
    msgError.setAttribute('style', 'display: block')
    msgError.innerHTML = '<strong>Preencha todos os campos corretamente antes de cadastrar</strong>'
    msgSuccess.innerHTML = ''
    msgSuccess.setAttribute('style', 'display: none')
  }
}

btn.addEventListener('click', ()=>{
  let inputSenha = document.querySelector('#senha')

  if(inputSenha.getAttribute('type') == 'password'){
    inputSenha.setAttribute('type', 'text')
  } else {
    inputSenha.setAttribute('type', 'password')
  }
})

btnConfirm.addEventListener('click', ()=>{
  let inputConfirmSenha = document.querySelector('#confirmSenha')

  if(inputConfirmSenha.getAttribute('type') == 'password'){
    inputConfirmSenha.setAttribute('type', 'text')
  } else {
    inputConfirmSenha.setAttribute('type', 'password')
  }
})

function enviarDadosPOST(url, dados) {
  // Configuração da requisição
  var requestOptions = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: dados,
  };

  // Realiza a requisição
  fetch(url, requestOptions)
      .then(response => response.json())
      .then(data => {
          console.log('Resposta do servidor:', data);
          msgSuccess.setAttribute('style', 'display: block')
  msgSuccess.innerHTML = '<strong>Cadastrando usuário...</strong>'
  msgError.setAttribute('style', 'display: none')
  msgError.innerHTML = ''

    setTimeout(()=>{
    window.location.href = '../html/signin.html'
   }, 3000)
      })
      .catch(error => {
          cmsgError.setAttribute('style', 'display: block')
          msgError.innerHTML = '<strong>ERRO NO</strong>'
          msgSuccess.innerHTML = ''
          msgSuccess.setAttribute('style', 'display: none')
      });
}
