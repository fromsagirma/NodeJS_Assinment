const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const hostname = "127.0.0.1";
const port = 8080;

// Map URLs to HTML files
const pages = {
    "/": "index.html",
    "/about": "about.html",
    "/contact-me": "contact-me.html"
};

// Create the HTTP server
const server = http.createServer(async (req, res) => {
    // Get the requested pathname
    const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;

    // Find the corresponding HTML file
    const fileName = pages[pathname];

    // If the route doesn't exist, serve the 404 page
    const isNotFound = !fileName;
    const selectedFile = fileName || "404.html";

    // Construct the full file path
    const filePath = path.join(__dirname, selectedFile);

    try {
        // Read the HTML file
        const content = await fs.readFile(filePath, "utf8");

        // Send the appropriate HTTP response
        res.writeHead(isNotFound ? 404 : 200, {
            "Content-Type": "text/html; charset=utf-8"
        });

        res.end(content);

    } catch (error) {
        console.error("Error reading HTML file:", error);

        res.writeHead(500, {
            "Content-Type": "text/plain; charset=utf-8"
        });

        res.end("500 - Internal Server Error");
    }
});

// Start listening for requests
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});