import http.server
import socketserver
import os
import sys

PORT = 5173
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

ENV_JS_CONTENT = '''window.ENV = {
  VITE_SUPABASE_URL: "https://jpultvoodifhjqmbsjvh.supabase.co",
  VITE_SUPABASE_PUBLISHABLE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwdWx0dm9vZGlmaGpxbWJzanZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2NTQ4MTcsImV4cCI6MjEwNTIzMDgxN30.xnGN2RbFYl2HHj583swTzU83GdOr9oHNO2EMPYjY6sk",
  VITE_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwdWx0dm9vZGlmaGpxbWJzanZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2NTQ4MTcsImV4cCI6MjEwNTIzMDgxN30.xnGN2RbFYl2HHj583swTzU83GdOr9oHNO2EMPYjY6sk"
};
'''

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        if self.path == '/env.js' or self.path.startswith('/env.js?'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/javascript')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
            self.end_headers()
            self.wfile.write(ENV_JS_CONTENT.encode('utf-8'))
            return
        return super().do_GET()

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def run_server():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        print("=" * 65)
        print(" VIORA -- Kerala District Blood Donor Matching Platform")
        print("=" * 65)
        print(f" [OK] Live Server running at: {url}")
        print(f" [OK] Supabase Backend: https://jpultvoodifhjqmbsjvh.supabase.co")
        print(" [OK] Press Ctrl+C to stop the server")
        print("=" * 65)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")
            httpd.server_close()

if __name__ == '__main__':
    run_server()
