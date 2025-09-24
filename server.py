#!/usr/bin/env python3
"""
Servidor HTTP simples para desenvolvimento local do LotoFácil Estratégica
Usage: python server.py [port]
Default port: 8000
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def guess_type(self, path):
        content_type = super().guess_type(path)
        if content_type[0] is None:
            if path.endswith('.js'):
                return ('application/javascript', None)
            elif path.endswith('.css'):
                return ('text/css', None)
        return content_type

def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    
    # Muda para o diretório do projeto
    project_dir = Path(__file__).parent
    os.chdir(project_dir)
    
    with socketserver.TCPServer(("", port), MyHTTPRequestHandler) as httpd:
        print(f"🚀 LotoFácil Estratégica rodando em:")
        print(f"   Local:    http://localhost:{port}")
        print(f"   Network:  http://127.0.0.1:{port}")
        print(f"   Pasta:    {project_dir}")
        print(f"\n📱 Pressione Ctrl+C para parar o servidor")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print(f"\n✅ Servidor parado com sucesso!")

if __name__ == "__main__":
    main()