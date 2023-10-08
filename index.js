const http = require("http");
const app = require("./src/app/config/express.config")
const server = http.createServer(app);

server.listen('3000','localhost',(err)=>{
    if(!err){
        console.log("Server is running in port 3000");
        console.log("Press CTRL+C to disconnect your server");
        console.log("User http://localhost:3000/ to browse your server");
    }

})