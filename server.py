"""
QuizMaster Pro - Local Development Server
Launches a lightweight HTTP server on port 8000 and opens the quiz app in your default browser.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def main():
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        print("=" * 60)
        print("⚡ QuizMaster Pro Local Server Running!")
        print(f"👉 Access URL: {url}")
        print("📁 Serving directory:", DIRECTORY)
        print("⌨️  Press Ctrl+C to stop the server")
        print("=" * 60)
        
        # Open in default browser automatically
        try:
            webbrowser.open(url)
        except Exception:
            pass

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server. Goodbye!")
            sys.exit(0)

if __name__ == "__main__":
    main()
