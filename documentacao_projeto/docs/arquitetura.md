# Arquitetura da aplicação

A aplicação deveria rodar em um ambiente Apache e, para tanto, o Apache foi configurado e instalado em uma máquina do Hugo para hostear a aplicação. Este servidor também foi configurado com um certificado SSL autoassinado a fim de que o servidor suportasse conexões HTTP e HTTPS, como requisitado pelo professor.

A fim de obedecer outra demanda arquitetural do professor, o Bind9 foi instalado a fim de se configurar e instalar uma solução de DNS. Com essa ferramenta, foi possível garantir que o site tivesse um nome de domínio adequado.
