//這裡是引入區
const jsonServer = require('json-server') //使用json-server套件
const jsonServerAuth = require('json-server-auth'); //使用json-server-auth套件
const data = require('./db.json'); //引入資料表(我們自己用的)
const server = jsonServer.create() //jsonServer有一個函式直接幫我們創express的伺服器
const router = jsonServer.router('db.json') //使用資料來源當作路由(json-server用的)
server.db = router.db //綁定 json-server 與 auth 的 db.json
const middlewares = jsonServer.defaults()
/* 是 jsonServer.defaults()提供的跨域、唯獨...的設定方法，用於設置中間件
，這些中間件通常用於增加功能或修改 JSON Server 的行為。以下是它的選項說明：
static: 這是一個指向靜態文件的路徑。如果您想讓 JSON Server 服務靜態文件（例如 HTML、CSS 或 JavaScript 文件），可以使用這個選項。路徑應該是一個包含靜態文件的目錄的絕對或相對路徑。
logger: 這個選項用於啟用或禁用 JSON Server 的日誌記錄中間件。默認值為 true，表示啟用日誌。如果設置為 false，則將禁用日誌。
bodyParser: 這個選項用於啟用或禁用 JSON Server 的 body-parser 中間件，該中間件用於解析請求主體中的 JSON 數據。默認值為 true，表示啟用 body-parser 中間件。如果設置為 false，則將禁用它。
noCors: 這個選項用於禁用 CORS（跨來源資源共享）。默認值為 false，表示不禁用 CORS。如果設置為 true，則將禁用 CORS，這可能對一些跨來源請求的情況有用。
readOnly: 這個選項用於設置 JSON Server 僅接受 GET 請求，也就是只允許讀取操作。默認值為 false，表示允許其他類型的請求（如 POST、PUT、DELETE）。如果設置為 true，則僅接受 GET 請求，並禁止寫入操作。 */
// /!\ Bind the router db to the app
server.db = router.db
//這裡是中介層
server.use(middlewares)//把json-server當作中介層塞進去，簡單來說就是執行json-server套件
server.use(jsonServerAuth)//使用json-server-auth當中介層，簡單來說就是執行json-server-auth套件

/*/可能以後會用到先留著
// server.get('/echo', (req, res) => {
//     res.jsonp(req.query)
//   })
//   server.use(jsonServer.bodyParser)
// server.use((req, res, next) => {
//   if (req.method === 'POST') {
//     req.body.createdAt = Date.now()
//   }
//   // Continue to JSON Server router
//   next()
// })
/*/

//下方可以開始寫路由
//查詢隊伍成員的功能
server.get('/teamsMember/:id', (req, res) => {
    
    const teamId = req.params.id;
    let teamMembers =[]
    if (data.teams[teamId]) {
        const team = data.teams.filter(item => item.id === parseInt(teamId))
        const teamMerberId=team[0].teamMerberId
        teamMerberId.forEach((v)=>{
            
            const teamMember =data.users.find((i)=>i.id === v)
            teamMembers.push(teamMember)
        })
        // console.log(teamMembers)
        res.status(200).json(teamMembers);
        
    } else {
        res.status(404).json({ message: '找不到隊伍' });
    }

  });
//依照讚數查詢
server.get('/teamsThumb', (req, res, next) => {
  let sort = req.query._sort;

 let teamsThumb = data.teams.map(team => {
    let thumb=data.users.find((v)=>{return v.id === team.userId}).thumb
    return {
      ...team,
      thumb
    };
  });
      let sortedTeams = []
      if(sort === "desc"){
        sortedTeams=teamsThumb.sort((a, b) => b.thumb - a.thumb);
      }else if(sort === "asc"){
        sortedTeams=teamsThumb.sort((a, b) => a.thumb - b.thumb);
      }else{
        sortedTeams=teamsThumb
      }
     
  res.status(200).json(sortedTeams)

});
  

server.use(router)//連接josn-server和express的關鍵詞

//開啟port這裡是3000
server.listen(3000, () => {
    console.log('JSON Server is running')
  })

//PS:express的原生寫法
// const express = require("express");
// const app = express();
// app.get("/", (req, res)=>{
//   res.setHeader("content-type","text/html;charset=utf-8");
//   res.end("網站主頁");
// });
// app.get("/home", (req, res)=>{
//   res.setHeader("content-type","text/html;charset=utf-8");
//   res.end("網站下的 home 的內容");
// });
// app.listen(3000, ()=>{
//   console.log("服務以啟動於 http://localhost:3000");
// });