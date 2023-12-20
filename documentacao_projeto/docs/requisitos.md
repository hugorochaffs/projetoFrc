# Requisitos

A aplicação a ser desenvolvida tem requisitos bastante específicos que devem ser atingidos a fim de obter a nota máxima no projeto. Estes requisitos estão listados adequadamente abaixo.

## Requisitos infraestruturais

Dentre os requisitos que não tratam da aplicação, mas sim da estrutura em que a aplicação deve ser executada, temos:

- A aplicação deve ser executada em um servidor Web Apache;
- Os clientes dessa aplicação deverão ser browsers de internet (Chrome, Mozilla Firefox, etc.);
- O servidor deve ter um nome Domain Name Server associado. Um exemplo seria algo como <www.projetofinalfrc.com>.
- Além do nome DNS, o servidor deve aceitar HTTP e HTTPS (portanto, deve ter um certificado).

## Requisitos da aplicação

Dentre os requisitos da aplicação, temos:

- Página apresentando o catálogo de temas e os usuários interessados neles;
- Usuários podem escolher temas de interesse para participar de conversas;
- Usuários devem ter nome, senha, capacidade de diálogo (chat, texto ou ambos) e status (este último não solicitado no cadastro);
- A aplicação deve permitir o contato entre dois ou mais usuários via WebSockets, com os usuários podendo convidar outros para dentro de suas chamadas/salas de bate-papo.
- A aplicação deve comportar salas simultâneas;
- Cada diálogo deve poder comportar duas ou mais pessoas;
- A aplicação deve gerenciar estabelecimento e encerramento de diálogos.
