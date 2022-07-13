const memphis = require("memphis-dev");
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const MEMPHIS_HOST = "broker.sandbox.memphis.dev";
const MEMPHIS_USERNAME = "restapi";
const MEMPHIS_TOKEN = "s0B7YGdbhcBnvHLSR4Gt";

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const memphisConnect = async () => {
    try {
        await memphis.connect({
            host: MEMPHIS_HOST,
            username: MEMPHIS_USERNAME,
            connectionToken: MEMPHIS_TOKEN
        });

        // producer
        producer = await memphis.producer({
            stationName: "rest-api",
            producerName: "rest_api_connector"
        });
    } catch (ex) {
        console.log(ex);
        memphis.close();
    }
}

memphisConnect()

app.post('/', (req, res) => {
    const msg = JSON.stringify(req.body)
    try{
        producer.produce({
            message: Buffer.from(msg)
        });
        res.sendStatus(200)
    } catch (ex) {
        console.log(ex);
        res.sendStatus(500)
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
