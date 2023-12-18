
function connectWebSocket(){

    username = "ABC"+ Math.random();

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

connectWebSocket();

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

var messageList = document.querySelector('#message-list');
var messageInput = document.querySelector('#msg');
var dest = document.querySelector('#dest');
var btnMessage = document.querySelector('#btn-send-msg');
btnMessage.addEventListener('click', sendMsgOnClick);

    

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
    