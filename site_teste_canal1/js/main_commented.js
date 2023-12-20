// Exibe uma mensagem no console indicando que o script main.js foi iniciado.
console.log("in main.js");
// Objeto que mapeia os pares (peers).
var mapPeers = {};

// Seleciona elementos do DOM.
var usernameInput = document.querySelector('#username');
var btnJoin = document.querySelector('#btn-join');

// Variável para armazenar o nome de usuário.
var username;

// Objeto WebSocket.
var webSocket;

// Função chamada quando ocorre um evento 'message' no WebSocket.
function webSocketOnMessage(event){
    // Analisa os dados recebidos como JSON.
    var parsedData = JSON.parse(event.data);
    var peerUsername = parsedData['peer'];
    var action = parsedData['action'];

    // Verifica se a mensagem pertence ao próprio usuário.
    if(username == peerUsername){
        return;
    }

    // Obtém o nome do canal de recepção.
    var receiver_channel_name = parsedData['message']['receiver_channel_name'];

    // Realiza ações com base na mensagem recebida.
    if(action == 'new-peer'){
        createOfferer(peerUsername, receiver_channel_name);
        return;
    }

    if(action == 'new-offer'){
        var offer = parsedData['message']['sdp'];
        createAnswerer(offer, peerUsername, receiver_channel_name);
        return;
    }

    if(action == 'new-answer'){
        var answer = parsedData['message']['sdp'];
        var peer = mapPeers[peerUsername][0];
        peer.setRemoteDescription(answer);
        return;
    }

    console.log('message:', message);
}

// Adiciona um ouvinte de evento 'click' ao botão de entrada.
btnJoin.addEventListener('click',()=>{
    // Obtém o nome de usuário inserido pelo usuário.
    username = usernameInput.value;

    // Verifica se o nome de usuário não está vazio.
    if(username == ''){
        return;
    }

    // Realiza algumas operações na interface do usuário após a entrada do usuário.
    usernameInput.value = '';
    usernameInput.disabled = true;
    usernameInput.style.visibility = 'hidden';
    btnJoin.disabled = true;
    btnJoin.style.visibility = 'hidden';

    // Atualiza o elemento de exibição do nome de usuário.
    var labelUsername = document.querySelector('#label-username');
    labelUsername.innerHTML = username;

    // Obtém o protocolo e o endpoint para o WebSocket.
    var loc = window.location;
    var wsStart = 'ws://';

    if(loc.protocol == 'https:'){
        wsStart = 'wss://';
    }

    var endPoint = wsStart + loc.host + loc.pathname;

    // Exibe o endpoint no console.
    console.log(endPoint);

    // Inicia o WebSocket e adiciona ouvintes de eventos.
    webSocket = new WebSocket(endPoint);
    webSocket.addEventListener('open', (e)=>{
        console.log('Connection Opened!');
        sendSignal('new-peer', {});
    });
    webSocket.addEventListener('message', webSocketOnMessage);
    webSocket.addEventListener('close',(e)=>{
        console.log('Connection Closed!');
    });
    webSocket.addEventListener('error',(e)=>{
        console.log('Error!');
    });
});

// Inicializa uma instância de MediaStream para a câmera e o microfone.
var localStream = new MediaStream();
const constraints = {
    'video': true,
    'audio': true
};

// Obtém a referência aos elementos de vídeo e botões.
const localVideo  = document.querySelector('#local-video');
const btnToggleAudio  = document.querySelector('#btn-toggle-audio');
const btnToggleVideo  = document.querySelector('#btn-toggle-video');

// ...

// Obtém referências a elementos da interface relacionados a mensagens.
var messageList = document.querySelector('#message-list');
var messageInput = document.querySelector('#msg');
var btnMessage = document.querySelector('#btn-send-msg');

// Adiciona ouvinte de evento ao botão de envio de mensagem.
btnMessage.addEventListener('click', sendMsgOnClick);

// Função para enviar mensagem quando o botão de envio é clicado.
function sendMsgOnClick(){
    var message = messageInput.value;

    // Adiciona a mensagem à lista de mensagens localmente.
    var li = document.createElement('li');
    li.appendChild(document.createTextNode('Me: ' + message));
    messageList.appendChild(li);

    // Obtém os canais de dados e envia a mensagem para cada um.
    var dataChannels = getDataChannels();
    message = username + ': ' + message;

    for(index in dataChannels){
        dataChannels[index].send(message);
        console.log('loop');
    }

    // Limpa o campo de entrada de mensagem.
    messageInput.value = '';
}

// Função para enviar sinalização através do WebSocket.
function sendSignal(action, message){
    var jsonStr = JSON.stringify({
        'peer': username,
        'action': action,
        'message': message,
    });
    webSocket.send(jsonStr);
}

// Função para criar um ofertante (peer) WebRTC.
function createOfferer(peerUsername, receiver_channel_name){
    // Cria uma nova instância de RTCPeerConnection.
    var peer = new RTCPeerConnection(null);

    // Adiciona as faixas locais ao peer.
    addLocalTracks(peer);

    // Cria um canal de dados.
    var dc  = peer.createDataChannel('channel');
    dc.addEventListener('open', ()=>{
        console.log('Connection Openned!');
    });
    
    dc.addEventListener('message', dcOnMessage);

    // Cria um elemento de vídeo remoto.
    var remoteVideo = createVideo(peerUsername);
    setOnTrack(peer, remoteVideo);

    // Mapeia o peer e o canal de dados.
    mapPeers[peerUsername] = [peer, dc];

    // Adiciona ouvinte para alterações no estado da conexão ICE.
    peer.addEventListener('iceconnectionstatechange', ()=>{
        var iceConnectionState = peer.iceConnectionState;

        if(iceConnectionState === 'failed'|| iceConnectionState === 'disconnected'|| iceConnectionState === 'closed'){
            delete mapPeers[peerUsername];

            if(iceConnectionState != 'closed'){
                peer.close();
            }
            removeVideo(remoteVideo);
        }
    });

    // Adiciona ouvinte para candidatos ICE.
    peer.addEventListener('icecandidate',(event)=>{
        if(event.candidate){
            console.log('new ice candidate:', JSON.stringify(peer.localDescription));
            return;
        }
        
        // Envia sinalização 'new-offer'.
        sendSignal('new-offer', {
            'sdp': peer.localDescription,
            'receiver_channel_name': receiver_channel_name
        });
    });

    // Cria uma oferta e define a descrição local.
    peer.createOffer()
        .then(o => peer.setLocalDescription(o))
        .then(()=>{
            console.log('Local description set successfully.');
        });
}

// Função para criar um respondente (peer) WebRTC.
function createAnswerer(offer, peerUsername, receiver_channel_name){
    // Cria uma nova instância de RTCPeerConnection.
    var peer = new RTCPeerConnection(null);

    // Adiciona as faixas locais ao peer.
    addLocalTracks(peer);

    // Cria um elemento de vídeo remoto.
    var remoteVideo = createVideo(peerUsername);
    setOnTrack(peer, remoteVideo);

    // Adiciona ouvinte para eventos de canal de dados.
    peer.addEventListener('datachannel', e =>{
        peer.dc = e.channel;

        peer.dc.addEventListener('open', ()=>{
            console.log('Connection Openned!');
        });
        
        peer.dc.addEventListener('message', dcOnMessage);
        mapPeers[peerUsername] = [peer, peer.dc];
    });

    // Adiciona ouvinte para alterações no estado da conexão ICE.
    peer.addEventListener('iceconnectionstatechange', ()=>{
        var iceConnectionState = peer.iceConnectionState;

        if(iceConnectionState === 'failed'|| iceConnectionState === 'disconnected'|| iceConnectionState === 'closed'){
            delete mapPeers[peerUsername];

            if(iceConnectionState != 'closed'){
                peer.close();
            }
            removeVideo(remoteVideo);
        }
    });

    // Adiciona ouvinte para candidatos ICE.
    peer.addEventListener('icecandidate',(event)=>{
        if(event.candidate){
            console.log('new ice candidate:', JSON.stringify(peer.localDescription));
            return;
        }
        
        // Envia sinalização 'new-answer'.
        sendSignal('new-answer', {
            'sdp': peer.localDescription,
            'receiver_channel_name': receiver_channel_name
        });
    });

    // Define a descrição remota com a oferta recebida.
    peer.setRemoteDescription(offer)
        .then(()=> {
            console.log('Remote description set successfully for %s.', peerUsername);

            // Cria uma resposta.
            return peer.createAnswer();
        })
        .then(a => {
            console.log('Answer created!');

            // Define a descrição local com a resposta.
            peer.setLocalDescription(a);
        });
}

// Função para adicionar faixas locais ao peer.
function addLocalTracks(peer){
    localStream.getTracks().forEach(track =>{
        peer.addTrack(track, localStream);
    });
    return;
}

// Função chamada quando ocorre um evento de mensagem no canal de dados.
function dcOnMessage(event){
    var message = event.data;

    // Adiciona a mensagem à lista de mensagens.
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(message));
    messageList.appendChild(li);
}

// Função para criar um elemento de vídeo remoto.
function createVideo(peerUsername){
    var videoContainer = document.querySelector('#video-container');
    var remoteVideo = document.createElement('video');

    remoteVideo.id = peerUsername + '-video';
    remoteVideo.autoplay = true;
    remoteVideo.playsInline= true;
    remoteVideo.className = 'video';

    var videoWrapper = document.createElement('div');

    videoContainer.appendChild(videoWrapper);
    videoWrapper.appendChild(remoteVideo);

    return remoteVideo;
}

// Função para configurar o ouvinte de faixa no peer.
function setOnTrack(peer, remoteVideo){
    var remoteStream = new MediaStream();

    remoteVideo.srcObject = remoteStream;

    peer.addEventListener('track', async (event) =>{
        remoteStream.addTrack(event.track, remoteStream);
    });
}

// Função para remover o elemento de vídeo.
function removeVideo(video){
    var videoWrapper = video.parentNode;

    videoWrapper.parentNode.removeChild(videoWrapper);
}

// Função para obter os canais de dados de todos os pares mapeados.
function getDataChannels(){
    var dataChannels = [];

    for (peerUsername in mapPeers){
        var dataChannel = mapPeers[peerUsername][1];

        dataChannels.push(dataChannel);
    }
    return dataChannels;
}
