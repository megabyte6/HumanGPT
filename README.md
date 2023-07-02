# HumanGPT

## Getting Started
To set up and run HumanGPT locally, follow the instructions in the [installation guide](#building). This guide will walk you through the necessary steps to get the game up and running on your machine.

## About
HumanGPT is an interactive and collaborative game where players use their creativity to generate unique answers based on given prompts. Powered by GPT-3, an advanced language model developed by OpenAI, HumanGPT offers an engaging and dynamic game-play experience for players of all ages.

---

## Key Features
- Interactive Game-play: HumanGPT offers an engaging and interactive game-play experience that encourages creativity and critical thinking.
- ChatGPT Integration: The game leverages the powerful ChatGPT language model to generate initial responses, ensuring a wide range of possibilities for each prompt.
- Random Prompt Assignment: Prompts and answers are randomly assigned to players, ensuring a fair and surprising distribution of challenges.
- Voting System: The game includes a built-in voting system, allowing players to choose the best response based on their preferences and criteria.
- Scalable Architecture: HumanGPT's architecture is designed to accommodate multiple players simultaneously, making it suitable for both small and large groups.

---

## How It Works
### Enter a Prompt:
Each player starts by submitting a prompt of their choice. It will start with a question word and you get to complete it! Try a fun or and creative phrase that can spark imagination.

### ChatGPT's Response:
The prompts are sent to ChatGPT, which generates a diverse set of answers based on the input. ChatGPT utilizes its advanced language processing capabilities to provide unique and contextually relevant responses.

### Random Assignment:
The game assigns the prompts and answers randomly to different players. This ensures that players receive prompts that they did not create, introducing an element of surprise and challenge.

### Creativity Unleashed:
Armed with word banks made from the responses, players must now construct their own responses for the prompts assigned to them. They can incorporate elements from the original answers or create entirely new ones based on their interpretation.

### Voting for the Best:
Once everyone has submitted their responses, players vote for the answer they believe is the best. Voting can be based on creativity, humor, or any other criteria agreed upon by the players.

### Winner Announcement:
The game calculates the votes and declares the winning answer, recognizing the player who provided the most impressive response. The winner can then take pride in their imaginative skills and bask in the glory of victory!

### Play again:
The host see a `Play Again` button so the fun can begin once more!

---

## Building
1. Install [node.js](https://nodejs.org/en/download) as you will need it to build and run the project.
1. Install [python](https://www.python.org/downloads/) for communicating with the GPT-3 server.
1. If you wish, create a virtual environment with the environment of your choice by using `python3 -m venv ./.venv` (or `python -m venv .\.venv` on Windows).
1. If you made a virtual environment, activate it. If you used `venv` then run `./.venv/bin/activate` (or `.\.venv\Scripts\Activate.ps1` on Windows)
1. Install the required dependencies with `pip install -r ./requirements.txt`.
1. Then, run `npm install` to install the required dependencies from node.js.
1. If you want to compile this project to vanilla JavaScript, use `npm run build`.

## Running
- If you compiled the project:
    - Open three terminals in the same directory and run the respective commands
        1. `npm run start`
        1. `node dist/server.js`
        1. `python3 ./gpt_endpoint/server.py` (or `python .\gpt_endpoint\server.py` on Windows).
- If you just want to start the server:
    - Open two terminals in the same directory and run the respective commands.
        1. `npm start`
        1. `python3 ./gpt_endpoint/server.py` (or `python .\gpt_endpoint\server.py` on Windows).

---

## Contributing
We welcome contributions to HumanGPT! If you have ideas for new features, bux fixes, or improvements, [create a new issue](https://github.com/megabyte6/HumanGPT/issues/new) or fix it yourself and [make a pull request](https://github.com/megabyte6/HumanGPT/pulls).

## License
HumanGPT is released under the [MIT License](https://github.com/megabyte6/HumanGPT/LICENSE) so feel free to use, modify, and/or distribute the code according to the terms outlined in the license.

---

## Contributors
- [peterpetep](https://github.com/peterpetep)
- [megabyte6](https://github.com/megabyte6)
- [crazzygamer182](https://github.com/crazzygamer182)

## Thanks to
- [gpt4free](https://github.com/xtekky/gpt4free/)
