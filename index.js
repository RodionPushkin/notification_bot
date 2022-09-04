const {Telegraf, Scenes, Markup, session} = require('telegraf')
const config = require('./config.json')
const bot = new Telegraf(config.bot.token)
const stage = new Scenes.Stage([require('./scenes/signup.scene')])
const db = require('./database');
// console.log()
bot.use(session())
bot.use(stage.middleware())
bot.use(require('./composers/start.composer'))
bot.launch().then(()=>{
    try{
        db.all("SELECT date('now')").then(res=>{
            console.log(res[0]["date('now')"],'Бот запущен!')
        })
    }catch(err){
        console.log(err)
    }
})
bot.on('text',ctx=>{
    console.log(ctx.message.chat.id)
})
