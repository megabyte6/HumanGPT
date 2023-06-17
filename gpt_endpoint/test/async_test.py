#!/usr/bin/env python3

import asyncio
import json

import aiohttp


async def main():
    async with aiohttp.ClientSession() as session:
        prompt = json.dumps(
            {
                "request": "Write a long paragraph about ChatGPT.",
                "chat": [],
            }
        ).encode("utf-8")

        await asyncio.gather(*[send_prompt(session, prompt) for _ in range(2)])


async def send_prompt(session: aiohttp.ClientSession, prompt: bytes):
    print(f"Prompt: {prompt}", end="\n\n")

    async with session.post("http://localhost:8008", data=prompt) as response:
        print(await response.text(), end="\n\n")


asyncio.run(main())
