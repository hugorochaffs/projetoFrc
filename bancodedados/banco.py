import http.server
import socketserver
import sqlite3
import json
from urllib.parse import urlparse, parse_qs

# Porta em que o servidor será executado
PORT = 8001

# Função para criar a tabela se não existir
def criar_tabela_USERS():
    with sqlite3.connect("banco.db") as connection:
        cursor = connection.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS USERS (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nickname VARCHAR(300) NOT NULL,
                password VARCHAR(300) NOT NULL,
                themes VARCHAR(300),
                constraint USERS_UK UNIQUE(nickname)
            )
            """
        )
        connection.commit()

def criar_tabela_THEMES():
    with sqlite3.connect("banco.db") as connection:
        cursor = connection.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS THEMES (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(300) NOT NULL,
                description VARCHAR(300) NOT NULL,
                constraint THEMES_UK UNIQUE(name)
            )
            """
        )
        connection.commit()

# Manipulador de requisições HTTP
class RequestHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_url = urlparse(self.path)
        query_params = parse_qs(parsed_url.query)

        if self.path == "/obter_usuarios":
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")  # Adiciona cabeçalho CORS
            self.end_headers()

            with sqlite3.connect("banco.db") as connection:
                cursor = connection.cursor()
                cursor.execute("SELECT * FROM USERS")
                usuarios = cursor.fetchall()

            self.wfile.write(json.dumps({"usuarios": usuarios}).encode())

        elif self.path == "/getThemes":
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")  # Adiciona cabeçalho CORS
            self.end_headers()

            with sqlite3.connect("banco.db") as connection:
                cursor = connection.cursor()
                cursor.execute("SELECT * FROM THEMES")
                themes = cursor.fetchall()

            self.wfile.write(json.dumps({"themes": themes}).encode())

        #elif self.path == "/getUsersByThemes":
        #    self.send_response(200)
        #    self.send_header("Content-type", "application/json")
        #    self.send_header("Access-Control-Allow-Origin", "*")  # Adiciona cabeçalho CORS
        #    self.end_headers()
        #
        #    with sqlite3.connect("banco.db") as connection:
        #        cursor = connection.cursor()
        #        cursor.execute("SELECT * FROM USERS WHERE THEMES=")
        #        themes = cursor.fetchall()

        #    self.wfile.write(json.dumps({"themes": themes}).encode())

        elif parsed_url.path == "/login":
            # Use query_params conforme necessário
            param1 = query_params.get('nickname', [''])[0]
            param2 = query_params.get('password', [''])[0]

            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")  # Adiciona cabeçalho CORS
            self.end_headers()

            with sqlite3.connect("banco.db") as connection:
                cursor = connection.cursor()

                # Exemplo de como incorporar os parâmetros na query
                query = f"SELECT id, nickname, themes FROM USERS WHERE nickname = ? AND password = ?"
                cursor.execute(query, (param1, param2))
                usuarios = cursor.fetchall()

            self.wfile.write(json.dumps({"usuarios": usuarios}).encode())
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == "/adicionar_usuario":
            content_length = int(self.headers["Content-Length"])
            post_data = self.rfile.read(content_length)
            dados = json.loads(post_data.decode())

            nickname = dados.get("nickname")
            password = dados.get("password")
            themes = dados.get("themes")

            with sqlite3.connect("banco.db") as connection:
                cursor = connection.cursor()
                cursor.execute("INSERT INTO USERS (nickname, password, themes) VALUES (?, ?, ?)", (nickname, password, themes))
                connection.commit()

            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")  # Adiciona cabeçalho CORS
            self.end_headers()
            self.wfile.write(json.dumps({"mensagem": "Usuário adicionado com sucesso"}).encode())

        elif self.path == "/adicionar_temas":
            content_length = int(self.headers["Content-Length"])
            post_data = self.rfile.read(content_length)
            dados = json.loads(post_data.decode())

            name = dados.get("name")
            description = dados.get("description")

            with sqlite3.connect("banco.db") as connection:
                cursor = connection.cursor()
                cursor.execute("INSERT INTO THEMES (name, description) VALUES (?, ?)", (name, description))
                connection.commit()

            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")  # Adiciona cabeçalho CORS
            self.end_headers()
            self.wfile.write(json.dumps({"mensagem": "Usuário adicionado com sucesso"}).encode())
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

# Configuração e execução do servidor
with socketserver.TCPServer(("", PORT), RequestHandler) as httpd:
    criar_tabela_USERS()
    criar_tabela_THEMES()
    print("Servidor rodando na porta", PORT)
    httpd.serve_forever()
