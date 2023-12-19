
username = "ABC"+ Math.random();




function pessoas(nickname,ttl){
    this.nickname = nickname;
    this.ttl = ttl;
}

const guardaPessoas = [];

function connectWebSocket(){

    console.log("my id:"+ username);

    var loc = window.location;
    var wsStart = 'ws://';

    if(loc.protocol == 'https:'){
        wsStart = 'wss://';
    }

    //var endPoint = wsStart + loc.host + loc.pathname;
    var endPoint = 'ws://localhost:8765/communications/c1';

    console.log(endPoint);

    webSocket = new WebSocket(endPoint);

    webSocket.addEventListener('open', (e)=>{
        console.log('Connection Opened!');

        //sendSignal('new-peer', {});
    });
    webSocket.addEventListener('message', webSocketOnMessage);
    webSocket.addEventListener('close',(e)=>{
        console.log('Connection Closed!');
    });
    webSocket.addEventListener('error',(e)=>{
        console.log('Error!');
    });

}

function connectWebSocketOnlineStatus(){

    

    console.log("Enviando Status");

    var loc = window.location;
    var wsStart = 'ws://';

    if(loc.protocol == 'https:'){
        wsStart = 'wss://';
    }

    //var endPoint = wsStart + loc.host + loc.pathname;
    var endPoint = 'ws://localhost:8765/status';


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

connectWebSocket();
connectWebSocketOnlineStatus();

function webSocketOnMessage(event){
    var parsedData = JSON.parse(event.data);
    var peerUsername = parsedData['peer'];
    var action = parsedData['action'];
    var msg = parsedData['message'];

    if(peerUsername == username){
        alert("mensagem recebida: "+ msg);
    }


    console.log('message:', parsedData);
}

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
        'peer': username,
        'status':'1',
        
    });
    
    webSocket.send(jsonStr);}




    function atualizaPessoasOnline(){

    guardaPessoas.forEach(pessoas => {
        pessoas.ttl--;

        if(pessoas.ttl<1)
            guardaPessoas.pop(pessoas);
    });

    
}

function mostraOnline(){

    var onlineList = document.querySelector('#online-list');

    onlineList.innerHTML = '';

    guardaPessoas.forEach(pessoas => {
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(pessoas.nickname));
        onlineList.appendChild(li);
    });
}

setInterval(enviaOnline, 500);
setInterval(mostraOnline, 500);
setInterval(atualizaPessoasOnline, 1000);

var messageList = document.querySelector('#message-list');
var messageInput = document.querySelector('#msg');
var dest = document.querySelector('#dest');

    

    function sendMsgOnClick(){


        var message = messageInput.value;

        var li = document.createElement('li');
        li.appendChild(document.createTextNode('Me: ' + message));
        messageList.appendChild(li);

            var jsonStr = JSON.stringify({
                   'peer': dest.value,
                   'action': "teste",
                   'message': message,
               });
               webSocket.send(jsonStr);
        

        messageInput.value = '';

    }
    