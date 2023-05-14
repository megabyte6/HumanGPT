# computer-science-project

## About
A game using GPT4

## Building
1. Install [node.js](https://nodejs.org/en/download) as you will need it to build and run the project.
1. Install [python](https://www.python.org/downloads/) for communicating with the GPT4 endpoint.
1. Run `pip install gpt4free` to install the required dependencies.
1. Then run `npm install` to install the required dependencies from node.js.
1. Set the IP address of your computer in `./client/script.js` and `./client/host/script.js`.
1. If you want to compile this project to vanilla JavaScript, use `npm run build`.

## Running
- If you compiled the project:
    - Open two terminals in the same directory
    - In one, run `npm run startgpt`
    - In the other, run `node dist/server.js`
- If you just want to start the server:
    - Open two terminals in the same directory
    - In one, run `npm run startgpt`
    - Run `npm run start`

## Contributors:
- [peterpetep](https://github.com/peterpetep)

## Thanks to
- [gpt4free](https://github.com/xtekky/gpt4free/)
