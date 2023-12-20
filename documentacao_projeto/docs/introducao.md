# Introdução

O projeto de pesquisa apresentado ao grupo apresentou um problema a ser resolvido com uma implementação em C ou Python com o intuito de aumentar a compreensão sobre websockets e HTTP. O problema apresentado era, basicamente, um ambiente Web em que usuários poderiam logar e encontrar-se com base em seus interesses. Uma explicação mais detalhada sobre o problema é oferecida na próxima seção.

## Detalhes do problema

O ambiente Web sugerido pelo problema deveria atender requisitos designados pela [definição do projeto de pesquisa](https://aprender3.unb.br/pluginfile.php/2774025/mod_resource/content/1/FRC_PROJ_PESQUISA_SERVDIALOGO.pdf). Dentre estes requisitos, é possível listar:

- A obrigatoriedade do uso de um servidor Apache, sendo o IP do host desta aplicação dotado de um nome DNS associado (i. e. nome de domínio);
- O servidor Apache deve suprir conexões HTTP e HTTPS para clientes como navegadores de internet;
- A aplicação deve apresentar um catálogo de temas e os usuários interessados em cada um deles (estes temas são pré-cadastrados);
- Os usuários, ao logar, devem informar os temas em que estão interessados;
- Um usuário deve ser cadastrado com nickname, senha e capacidades de diálogo (chat de mensagens, video chat ou ambos);
- Um usuário deve ter informações como nickname, status (online, ocupado e offline), e ícones relativos à capacidades de diálogo admitidas;
- A aplicação deve permitir a omunicação entre dois ou mais usuários considerando suas capaciades de diálogo via websockets;
- A aplicação deve comportar dois ou mais diálogos simultâneos;
- A aplicação deve controlar os diálogos.

Além destes pontos, a aplicação deveria ser montada em C ou Python e estar devidamente comentada. Fora isso, se o time conseguir realizar uma implantação em HTTP/2, o projeto valerá mais pontos.

## Solução apresentada

A solução desenvolvida pelo grupo utiliza-se de um servidor de WebSocket em Python para estabelecer as comunicações e verificações de status de um usuário. O banco de dados SQLite também tem sua implementação em Python. A parte Web da aplicação foi desenvolvida em HTML, CSS e JS puro, sem o uso de frameworks para sua implementação. A aplicação está disponível em um servidor Apache com certificados (para a implementação de HTTPS) no link <>.
