const net = require("net");

console.log("Logs...");

const RESPONSE_OK = "200 OK";
const RESPONSE_NOT_FOUND = "404 Not Found";
const CONTENT_TYPE = "text/plain";
const header = {};


function buildResponse() {

	if (header["GET"].includes("/user-agent")) {
		return `HTTP/1.1 ${RESPONSE_OK}\r\nContent-Type: ${CONTENT_TYPE}\r\nContent-Length: ${header["User-Agent"].length}\r\n\r\n${header["User-Agent"]}`;
	}
	else if (header["GET"] === "/") {
		return `HTTP/1.1 ${RESPONSE_OK}\r\n\r\n`;
	}
	else if (header["GET"].includes("/echo")) {
		return `HTTP/1.1 ${RESPONSE_OK}\r\nContent-Type: ${CONTENT_TYPE}\r\nContent-Length: ${header["GET"].split("/echo/").length}\r\n\r\n${header["GET"].split("/echo/")}`;
	}
	else {
		return `HTTP/1.1 ${RESPONSE_NOT_FOUND}\r\n\r\n`;
	}
}

const server = net.createServer((socket) => {
    socket.on("close", () => {
		socket.end();
		server.close();
	});
	socket.on("data", (data) => {
		const path = data.toString().split("\r\n").filter(e => e);
		for (const i of path) {
			const [key, value] = i.split(" ");
			header[key.replace(":", "")] = value;
		}

		console.log(path);
		console.log(header);
		socket.write(buildResponse());
	});
});

server.listen(4221, "localhost");
