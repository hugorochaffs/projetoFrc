# Solução implementada

A solução implementada utiliza-se de um servidor WebSocket implementado em Python. Grosso modo, toda a comunicação da solulçao perpassa por este servidor, de maneiras sutis ou não. A biblioteca escolhida para esta aplicação foi a biblioteca `websockets`.

## Descrição da solução

O servidor em si possui uma implementação relativamente simples. Contudo, esta implementação simples é consumida de forma a gerenciar toda a arquitetura principal da aplicação via JavaScript.

## Servidor WebSocket

O servidor pode ser descrito a partir de uma única classe `ChatServer()`. Esta classe possui as funções `handle_message` e `handle_consumer`. Suas funcionalidades estão descritas abaixo.

- **handle_message**: Simplesmente verifica se o cliente não é o próprio servidos WebSocket e espera pela mensagem;
- **handle_consumer**: recebe um caminho (**path**) que deve ser algo como "canal1", "canal2", etc. Não havendo um canal dentro do servidor, ele é configurado. Então, enquanto necessário, utiliza-se de `handle_message`para lidar com as mensagens e depois fecha o canal.

### Uso do servidor WebSocket

O servidor websocket implementado é utilizado de maneiras interessantes durante a execução da aplicação. As descrições do funcionamento estão disponíveis abaixo.

#### Lobby

O lobby da aplicação utiliza-se do servidor WebSocket de modo a verificar quem está oline a fim de permitir a comunicação com os outros usuários. O código JavaScript dedicado a esta página possui uma gama de funções que utilizam-se do servidor websocket e do banco de dados para constantemente retribuir os status dos usuários e assim poder renderizar (ou não) os ícones adequados.

## Banco de dados

O banco de dados da aplicação é um SQlite3 implementado também a partir de código Python. As funções deste banco estão definidas abaixo:

- **criar_tabela_USERS**: Cria uma tabela USERS se inexistente com as colunas _id, nickname, password, themes, capacidades_ e um constraint *USERS_UK*;
- **criar_tabela_THEMES**: Cria uma tabela THEMES se inexistente com as colunas _id, name, description_ e a constraint *THEMES_UK*;
- **RequestHandler**: Recebe as requisições HTTP e lida com elas de acordo, criando caminhos para a obtenção de resultados de queries específicas.

## Histórico de versão

| Versão |    Data    |      Descrição       |   Autor   |  Revisor  |
| :----: | :--------: | :------------------: | :-------: | :-------: |
| `1.0`  | 17/12/2023 | Adição da página da solução | Felipe M. |  |
