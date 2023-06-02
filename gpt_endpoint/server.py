#!/usr/bin/env python3
# A web server to echo back a request's headers and data.
# credit: @nickjj
#
# Usage: ./server
#        ./server 0.0.0.0:5000

from http.server import HTTPServer, BaseHTTPRequestHandler
from sys import argv
import json
import gpt4free
from gpt4free import Provider


BIND_HOST = "localhost"
PORT = 8008


class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.write_response(b"")

    def do_POST(self):
        print("received")
        content_length = int(self.headers.get("content-length", 0))
        body = self.rfile.read(content_length)
        print("Request:", body.decode("utf-8"))
        gpt_request = json.loads(body.decode("utf-8"))
        response = json.loads("{}")
        receivestuff()
        
    async def receivestuff(response){
        await response["response"] = gpt4free.Completion.create(Provider.You, prompt=gpt_request["request"],chat=gpt_request["chat"])     
        self.write_response(response)
    }
    async def write_response(self, content):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(json.dumps(content).encode())

        #print(self.headers)
        print(content)


if len(argv) > 1:
    arg = argv[1].split(":")
    BIND_HOST = arg[0]
    PORT = int(arg[1])

print(f"Listening on http://{BIND_HOST}:{PORT}\n")

httpd = HTTPServer((BIND_HOST, PORT), SimpleHTTPRequestHandler)
httpd.serve_forever()