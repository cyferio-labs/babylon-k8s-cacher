import * as path from "path";
import { HttpServer } from "tsrpc";
import { serviceProto } from "./shared/protocols/serviceProto";

// Create the Server
const server = new HttpServer(serviceProto, {
    apiTimeout: 999999,
    keepAliveTimeout: 999999,
    port: 3001,
    // Remove this to use binary mode (remove from the client too)
    json: true
});

// Initialize before server start
async function init() {
    // Auto implement APIs
    await server.autoImplementApi(path.resolve(__dirname, 'api'));

    // TODO
    // Prepare something... (e.g. connect the db)
};

// Entry function
async function main() {
    await init();
    await server.start();
};
main();