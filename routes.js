const fs = require("fs");

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    if (req.url === "/") {
        res.write("<html>");
        res.write("<head><title>Enter Message</title><head>");
        res.write(
            '<body><form action="/message" method="POST"><input type="text" name="id"><input type="text" name="message"><button type="submit">Send</button></form></body>'
        );
        res.write("</html>");
        return res.end();
    }
    if ((req.url === "/message") & (method === "POST")) {
        const body = [];
        req.on("data", (data) => {
            console.log(data);
            body.push(data);
        });
        return req.on("end", () => {
            const parsedBody = Buffer.concat(body).toString();
            fs.writeFile("message.txt", parsedBody, (err) => {
                res.statusCode = 302;
                res.setHeader("Location", "/");
                return res.end();
            });

            console.log(parsedBody);
        });
    }
};

module.exports = requestHandler;
