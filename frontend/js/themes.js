

var loc = window.location;
    //var endPoint = wsStart + loc.host + loc.pathname;
var host = loc.host.split(":")[0];

var serverBanco = loc.protocol+ '//' +host + ':8001';
var serverWebsocket =  host + ':8765';

const urlCad = serverBanco + '/adicionar_usuario';
const urlFetchUsuario = serverBanco + '/obter_usuarios';
const urlFetchThemes = serverBanco + '/getThemes';

var urlAtual = window.location.href;
var urlClass = new URL(urlAtual);
var id = urlClass.searchParams.get("id");
var nickname = urlClass.searchParams.get("nickname");
var minhasCapacidades = urlClass.searchParams.get("capacidades");

var usersAConsultar = [];
var usersComCamera = [];




const tema_usuario = {};

/**

tema_usuario = {
    1: [usuario1, usuario2, usuario3],
    2: [],
    3: [usuario1, usuario2],
}

 */


let saudacao = document.querySelector('#saudacao')
saudacao.innerHTML = "Olá, "+nickname;




// PARTE DA VERIFICACAO DE ONLINE

function pessoas(nickname,ttl){
    this.nickname = nickname;
    this.ttl = ttl;
}
const guardaPessoas = [];



function connectWebSocketOnlineStatus(){

    console.log("Enviando Status");

    
    var wsStart = 'ws://';

    if(loc.protocol == 'https:'){
        wsStart = 'wss://';
    }
    
    var endPoint = wsStart+serverWebsocket+'/status';


    webSocket = new WebSocket(endPoint);

    webSocket.addEventListener('open', (e)=>{
        console.log('Connection Opened!');

        //sendSignal('new-peer', {});
    });
    webSocket.addEventListener('message', atualizaStatus);
    webSocket.addEventListener('close',(e)=>{
        console.log('Connection Closed!');
    });
    webSocket.addEventListener('error',(e)=>{
        console.log('Error!');
    });

}

connectWebSocketOnlineStatus();

function atualizaStatus(event){
    var parsedData = JSON.parse(event.data);
    var peerUsername = parsedData['peer'];

    console.log(event.data);

    var p = guardaPessoas.find(person => person.nickname === peerUsername);

    if (!p){

        var p = new pessoas(peerUsername, '10');

        guardaPessoas.push(p);
    }
    else{
        p.ttl = 10;
    }
    
}

function enviaOnline(){

    var jsonStr = JSON.stringify({
        'peer': id,
        'status':'ONLINE',
        
    });
    
    webSocket.send(jsonStr);}


    function atualizaPessoasOnline(){

    guardaPessoas.forEach(pessoas => {
        pessoas.ttl--;

        if(pessoas.ttl<1){
            guardaPessoas.pop(pessoas);
            var qs = document.querySelectorAll('.ST'+pessoas.nickname);
                qs.forEach(q=>{
                    q.innerHTML="OFFLINE";
                });
                var btc = document.querySelectorAll('.BTC'+pessoas.nickname);
                btc.forEach(q=>{
                    q.hidden=true;
                });
                var btv = document.querySelectorAll('.BTV'+pessoas.nickname);
                if(usersComCamera.includes(pessoas.nickname)){
                    btv.forEach(qq=>{
                        qq.hidden=true;
                    });
                }
            }
    });

    
}

setInterval(enviaOnline, 500);
setInterval(consultaStatus, 3000);
setInterval(atualizaPessoasOnline, 1000);
connectWebSocketConvites();


function consultaStatus(){


        guardaPessoas.forEach(pessoas => {
            if(usersAConsultar.includes(pessoas.nickname)){
                
                var qs = document.querySelectorAll('.ST'+pessoas.nickname);
                qs.forEach(q=>{
                    q.innerHTML="ONLINE";
                });
                var btc = document.querySelectorAll('.BTC'+pessoas.nickname);
                btc.forEach(q=>{
                    q.hidden=false;
                });
                var btv = document.querySelectorAll('.BTV'+pessoas.nickname);
                if(usersComCamera.includes(pessoas.nickname)){
                    btv.forEach(qq=>{
                        qq.hidden=false;
                    });
                }
            }

            
        });
}




//------------------------------------------------------------------------



//-----------------Parte de convite de chat e video


function connectWebSocketConvites(){

    username = id;

    var loc = window.location;
    var wsStart = 'ws://';

    if(loc.protocol == 'https:'){
        wsStart = 'wss://';
    }

    //var endPoint = wsStart + loc.host + loc.pathname;
    var endPointConvites = wsStart+serverWebsocket+'/convites';

    console.log(endPointConvites);

    webSocketConvites = new WebSocket(endPointConvites);

    webSocketConvites.addEventListener('open', (e)=>{
        console.log('Connection Opened!');

        //sendSignal('new-peer', {});
    });
    webSocketConvites.addEventListener('message', webSocketOnConvite);
    webSocketConvites.addEventListener('close',(e)=>{
        console.log('Connection Closed!');
    });
    webSocketConvites.addEventListener('error',(e)=>{
        console.log('Error!');
    });

}

function webSocketOnConvite(event){
    var parsedData = JSON.parse(event.data);
    var peerUsername = parsedData['peer'];
    var peerRemetente = parsedData['rpeer'];
    var action = parsedData['action'];
    var tipoRecebido = parsedData['tipo'];
    var salaRecebida = parsedData['sala'];

    if(action == "convite" && peerUsername == username){
        if(confirm("Solicitacao de "+tipoRecebido+" recebida de "+ peerRemetente)){

            var jsonStrAceitaConvite = JSON.stringify({
                'peer': peerRemetente,
                'rpeer': username,
                'action': "aceitaConvite",
                'tipo': tipoRecebido,
                'sala': salaRecebida
            });
            webSocketConvites.send(jsonStrAceitaConvite);

            window.location.href = "chat/"+ salaRecebida;

        }else{

            var jsonStrRecusaConvite = JSON.stringify({
                'peer': peerRemetente,
                'rpeer': username,
                'action': "recusaConvite",
                'tipo': tipoRecebido,
                'sala': salaRecebida
            });
            webSocketConvites.send(jsonStrRecusaConvite);

        }
    }
    else if(action == "aceitaConvite" && peerUsername == username){
        
        console.log(peerRemetente+" aceitou seu convite");
        window.location.href = "chat/"+ salaRecebida;
    }
    else if(action == "recusaConvite" && peerUsername == username){
        console.log(peerRemetente+" rejeitou seu convite");
    }
    


    console.log('message:', parsedData);
}


function sendConvite(peer,tipo){

        var sala = "?tipo="+tipo+"&peer1="+peer+"&peer2="+username;

        var jsonStr = JSON.stringify({
               'peer': peer,
               'rpeer': username,
               'action': "convite",
               'tipo': tipo,
               'sala': sala,
           });
           webSocketConvites.send(jsonStr);

}

//------------------------------------------------------------------------






function populaTemaUsuario() {

    // fetch temas 

    const url = urlFetchUsuario;
    const usuarios = [];

    fetch(url).then(response => response.json()).then(data => {
        // console.log('data',data);
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
        console.log('data',data);
        console.log(tema_usuario);
        // const temas = [];
        const divThemes = document.getElementById('themes');
        data.themes.forEach(theme => {
        
            
            // console.log(theme);
            
            const divtheme = document.createElement('div');
            divtheme.id = theme[0];
            divtheme.className = 'theme';

            const label = document.createElement('h1');
            label.appendChild(document.createTextNode(theme[1]));
            divtheme.appendChild(label);

            divThemes.appendChild(divtheme);

            console.log('tema: ', theme[0], tema_usuario[theme[0]]);
             
            if(tema_usuario[theme[0]]) {

                for(const user of tema_usuario[theme[0]]){

                    if(user[0]!= id){
                    
                        if(!usersAConsultar.includes(user[0]))
                            usersAConsultar.push(String(user[0]));
                        if(!usersComCamera.includes(user[0]) && user[4] == '1' && minhasCapacidades == '1')
                            usersComCamera.push(String(user[0]));
                        const divUser = document.createElement('div');
                        divUser.id = user[0];
                        divUser.className = 'user';
                        const labelUser = document.createElement('h3');
                        labelUser.appendChild(document.createTextNode(user[1]));
                        divUser.appendChild(labelUser);

                        const labelStatus = document.createElement('h5');
                        labelStatus.className = "ST"+user[0];
                        labelStatus.appendChild(document.createTextNode("OFFLINE"));
                        divUser.appendChild(labelStatus);

                        const buttonVideo = document.createElement('button');
                        buttonVideo.innerHTML = "Video";
                        buttonVideo.className = "BTV"+user[0];
                        buttonVideo.hidden = true;
                        buttonVideo.onclick = ()=> sendConvite(user[0],"video");
                        divUser.appendChild(buttonVideo);

                        const buttonChat = document.createElement('button');
                        buttonChat.innerHTML = "Chat";
                        buttonChat.className = "BTC"+user[0];
                        buttonChat.hidden = true;
                        buttonChat.onclick =  ()=> sendConvite(user[0],"chat");
                        divUser.appendChild(buttonChat);
                        
                        divtheme.appendChild(divUser);
                    }
                }
            }
            // const users = fetchUsersByThemes(theme)
            
        })
    })
}

// fetchUsers();

fetchUsuariosandPopulaTemas();