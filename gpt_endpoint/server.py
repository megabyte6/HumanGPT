#!/usr/bin/env python3
# Usage: ./server
#        ./server localhost:8080

import asyncio
import json
from sys import argv

from aiohttp import web
from gpt4free import Completion, Provider


class Server:
    def __init__(self, bind_host="127.0.0.1", bind_port=8008, verbose=False):
        self.host = bind_host
        self.port = bind_port
        self.verbose = verbose

        self.app = web.Application()
        self.app.router.add_routes(
            [
                web.post("/", self.handle_post),
            ]
        )

    async def start(self):
        """
        Asynchronously starts the web server on the specified host and port.

        Returns:
            None
        """

        runner = web.AppRunner(self.app)
        await runner.setup()
        site = web.TCPSite(runner, self.host, self.port)
        await site.start()

        if self.verbose:
            print(f"Listening on http://{self.host}:{self.port}")

    async def handle_post(self, request: web.Request):
        """
        Asynchronously handles a POST request by reading the request content, decoding it,
        and creating a response using data from the request. The response is then returned
        as a JSON response object.

        Args:
            request (web.Request): The HTTP request object.

        Returns:
            web.Response: A response object containing the response data in JSON format.
        """

        body = await request.content.read()
        data = body.decode("utf-8")
        if self.verbose:
            print(f"Received POST request: {data}")

        gpt_request = json.loads(data)
        response = {}
        response["response"] = Completion.create(
            provider=Provider.You,
            prompt=gpt_request["request"],
            chat=gpt_request["chat"],
        )

        if self.verbose:
            print(f"Response: {response}")

        return web.json_response(response)


if __name__ == "__main__":
    HOST = "127.0.0.1"
    PORT = "8008"

    if len(argv) > 1:
        arg = argv[1].split(":")
        HOST = arg[0]
        PORT = int(arg[1])

    server = Server(HOST, PORT, verbose=True)

    loop = asyncio.get_event_loop()
    loop.run_until_complete(server.start())
    loop.run_forever()
