# WheeL: Automata (Server) &nbsp;![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white) ![Hono](https://img.shields.io/badge/Hono-E36002?style=for-the-badge&logo=hono&logoColor=fff) ![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

For more details about this project general idea, [visit the client version of this project.](https://github.com/GLPG35/wheel-automata)

<img src="https://wheel-automata.vercel.app/yorha.png" align="right" width="200px" height="auto" />

<h2 id="toc">How it works</h2>

This project was made using Hono with Bun, and was written in TypeScript. It also uses Cloudflare D1 SQL Database to store the items, as it's free.<br />

The server consists of three endpoints:

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

### Environment variables

This project needs a couple environment variables to be set, otherwise it won't work:

`CLOUDFLARE_API_KEY`

The API key of your Cloudflare account.

`CLOUDFLARE_EMAIL`

The email of your Cloudflare account.

`DB_ID`

The ID of your Cloudflare D1 SQL Database (you need to create one first).

`ACCOUNT_ID`

Your Cloudflare account ID (you can get it from the URL in your dashboard).

`SECRET`

Your secret to store the cookies on the client side and to encrypt the JWT.

`TRUE_HASH`

The password to access the website. In my case I used a very long hash, but you can use whatever you like.

`CLIENT_URL`

The URL of the client application (for CORS). For example: http://localhost:5173

### Running

If you want to run this project in developer mode just write:

	bun dev

And if you want to start the project normally:

	bun src/index.ts

---

## License

![MIT License](https://img.shields.io/badge/MIT-license?style=for-the-badge&label=LICENSE)