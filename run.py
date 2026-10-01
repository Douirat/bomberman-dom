from http.server import SimpleHTTPRequestHandler, HTTPServer
import os

class SPAHandler(SimpleHTTPRequestHandler):

    def do_GET(self):
        path = self.translate_path(self.path)

        if not os.path.exists(path):
            self.path = "/index.html"

        return super().do_GET()


server = HTTPServer(("0.0.0.0", 8080), SPAHandler)

print("Server running on http://localhost:8080")

server.serve_forever()