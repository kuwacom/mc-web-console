const http = require('http');
const fs = require('fs');
const ws = require("ws")
const child_process = require("child_process");
const readline = require("readline");
readline.emitKeypressEvents(process.stdin);

// const html = fs.readFileSync("./test1.txt", 'utf8');
// const js = fs.readFileSync("./test1.txt", 'utf8');

const websocket = ws.Server;
const wsserver = new websocket({ port: 56145 });

wsserver.on("connection", ws => {
    ws.on("message", message => {
        console.log("Received: " + message);

        if (message === "hello") {
            ws.send("hello from server");
        }
    });
});


let server = http.createServer(function(request, response){
    console.log(request.url)
    let html = ""
    try{
        html = fs.readFileSync("."+request.url, 'utf8');
    }catch (e){
        html = "error"
    }
    response.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'});
    response.end(html);
})
server.listen(80);



console.log("parent:" + process.pid);
let proc =  child_process.spawn("bedrock_server.exe",{cwd:"./server/"});
// let proc =  child_process.spawn("",{cwd:"./server/"});
console.log("child:" + proc.pid);

proc.stdout.on('data', (data) => {
    console.log(data.toString());
});

(async function(){
while (1){
    await new Promise(resolve=>{
        // process.stdin.on("keypress",function self(key,ch){
        //     if(ch.name=="return") {
        //         //自分のイベントを削除
        //         process.stdin.removeListener("keypress",self);
        //         return resolve();
        //     }
        //     //文字として取得
        //     console.log(key);
        //     proc.stdin.write(key+"\n");
        //     //キーボードステータスの取得
        //     // console.log(ch);
        // });
        // rl.question("question", (answer) => {
        //     console.log(answer)
        //     resolve();
        //     rl.close();
        // });
        let out = ""
        process.stdin.on("keypress",function self(key,ch){
            if(ch.name=="return") {
                process.stdin.removeListener("keypress",self);
                proc.stdin.write(out+"\n")
                return resolve();
            }
            out += key;

        })
    })
}
})();