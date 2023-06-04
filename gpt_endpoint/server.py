#!/usr/bin/env python3
# Usage: ./server
#        ./server 0.0.0.0:5000

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from sys import argv
from gpt4free import Completion, Provider


BIND_HOST = "localhost"
PORT = 8008


class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        """
        Handle GET requests.

        This method is called by the server whenever a GET request is received.
        It writes an empty response to the client.

        Returns: None
        """

        self.send_to_client(b"")

    def do_POST(self):
        """
        An asynchronous function that handles POST requests. It reads the
        content length of the request headers, decodes the request body, and
        sends the data to the "request_from_gpt" method.

        Returns: None
        """

        print("Received POST request")
        content_length = int(self.headers.get("content-length", 0))
        body = self.rfile.read(content_length)

        data = body.decode("utf-8")
        print("Request:", body.decode("utf-8"))
        self.request_from_gpt(data)

    async def request_from_gpt(self, gpt_request):
        """
        Asynchronously handles a POST request from a client. Reads the request
        body, extracts a JSON object, creates a GPT-3 completion request using
        the extracted "request" and "chat" fields from the JSON, and sends the
        response in a JSON object with the "response" field.

        Returns: None
        """

        gpt_request = json.loads(gpt_request)
        response = json.loads("{}")
        response["response"] = await Completion.create(
            Provider.You,
            prompt=gpt_request["request"],
            chat=gpt_request["chat"],
        )

        self.send_to_client(response)

    def send_to_client(self, content):
        """
        Write a response to the client.

        This method takes a bytes object as an argument and writes it as a response to the client.

        Returns: None
        """

        self.send_response(200)
        self.end_headers()
        self.wfile.write(json.dumps(content).encode())

        # I'm not sure if we need this but I'm too scared to delete it.
        #print(self.headers)
        print(content)


def start_server():
    print(f"Listening on http://{BIND_HOST}:{PORT}\n")

    httpd = HTTPServer((BIND_HOST, PORT), SimpleHTTPRequestHandler)
    httpd.serve_forever()


if __name__ == "__main__":
    if len(argv) > 1:
        arg = argv[1].split(":")
        BIND_HOST = arg[0]
        PORT = int(arg[1])
