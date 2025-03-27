# WheeL: Automata (Server) &nbsp;![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white) ![Hono](https://img.shields.io/badge/Hono-E36002?style=for-the-badge&logo=hono&logoColor=fff) ![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

For more details about this project general idea, [visit the client version of this project.](https://github.com/GLPG35/wheel-automata)

<img src="https://wheel-automata.vercel.app/yorha.png" align="right" width="200px" height="auto" />

## How it works

This project was made using Hono with Bun, and was written in TypeScript.<br />
It consists of three endpoints:

`/api` In charge of fetching the items from the database.

`/auth` To check if the user is logged in (via JWT), or to log in.

`/ws` The most important one. Allows communication in real time between all the connected users and the server. Keeps in sync the spinning wheel and updates in real time the changes to the database.

## How to run this project

Install the necessary dependencies:

- [Bun](https://bun.sh/)
- [Git](https://git-scm.com/downloads)

Now in your favorite terminal write this commands:

	git clone 'https://github.com/GLPG35/wheel-automata-server.git'
	cd wheel-automata-server
	bun install

If you want to run this project in developer mode just write:

	bun dev

And if you want to start the project normally:

	bun src/index.ts

---

## License

![MIT License](https://img.shields.io/badge/MIT-license?style=for-the-badge&label=LICENSE)