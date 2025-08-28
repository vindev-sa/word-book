const express = require("express");
const app = express();

const port = process.env.port || 3000;

app.use('/assets', express.static(__dirname + '/src/public/'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/views/index.html')
});

app.listen(3000, error => {
    if (error) {
        console.log(`There was an error with this page: ${error}`);
    }
    console.log(`The server is listening on http://localhost:${port}. Press CTRL+C x2 to quit.`);
});