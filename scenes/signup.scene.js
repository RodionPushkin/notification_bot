const {Scenes,Markup} = require('telegraf')
const config = require('../config.json')
const db = require('../database');
const token = require('../config.json').bot.token
const axios = require('axios').default;
const fs = require('fs')
// const Jimp = require('jimp');
const sharp = require('sharp');
const download = require('download')
const {cover} = require("jimp");
// const chatId = -1001413410482
const chatId = 1299761386
module.exports = new Scenes.WizardScene(
    'signup',
    async (ctx) => {
        try {
            if(chatId != ctx.message.chat.id){
                ctx.scene.leave()
            }else{
                ctx.session.user = {
                    idUser: ctx.message.from.id
                }
                ctx.replyWithHTML(`Пожалуйста напишите о себе, например:\n"Привет меня зовут ALTER_FUCKIN_EGO,\nя бот и моя задача красиво представить вас в сообществе".\nНапишите здесь все, что хотели бы о себе рассказать`,Markup.removeKeyboard())
                ctx.wizard.next()
            }
        } catch (err){
            console.log(err)
        }
    },
    async (ctx) => {
        try {
            if(ctx.message?.text){
                if(!ctx.session.user?.biography){
                    ctx.session.user.biography = ctx.message.text
                }
                ctx.replyWithHTML(`Пожалуйста пришлите своё фото`,Markup.removeKeyboard())
                ctx.wizard.next()
            }else{
                ctx.replyWithHTML(`Пожалуйста напишите о себе, например:\n"Привет меня зовут ALTER_FUCKIN_EGO,\nя бот и моя задача красиво представить вас в сообществе".\nНапишите здесь все, что хотели бы о себе рассказать`,Markup.removeKeyboard())
            }
        } catch (err){
            console.log(err)
        }
    },
    async (ctx) => {
        try {
            if(ctx.message?.photo){
                let fileFromUrl = undefined
                let fileName;
                let editedFile;
                axios.get(`https://api.telegram.org/bot${token}/getFile?file_id=${ctx.message.photo[2].file_id}`).then(res=>{
                    fileFromUrl = `https://api.telegram.org/file/bot${token}/${res?.data?.result?.file_path}`
                    fileName = res.data.result.file_path.split("/")[1]
                }).then(()=>{
                    download(fileFromUrl, './tmp/').then((res)=>{
                        sharp(`./tmp/${fileName}`).resize(800,800).gamma().modulate({
                            brightness: 0.7,
                            saturation: 0.5,
                        })
                            .composite([{input:'./tmp/card.png'}])
                            .toFile(`./tmp/${fileName.split('.')[0]}.${ctx.session.user.idUser}-edited.jpg`)
                        editedFile = `./tmp/${fileName.split('.')[0]}.${ctx.session.user.idUser}-edited.jpg`
                        setTimeout(()=>{
                            ctx.reply(`Готово:`).then(()=>{
                                console.log(editedFile)
                                ctx.replyWithPhoto({ source: editedFile }).then(()=>{
                                    ctx.replyWithHTML(`${ctx.session.user.biography}`).then(()=>{
                                        fs.unlink(`./tmp/${fileName}`, (err) => {
                                            if (err) {
                                                throw err;
                                            }
                                            ctx.session.user.image = editedFile
                                            console.log(ctx.session.user)
                                            db.run(`INSERT INTO 'user' (biography,IDUser,image) VALUES ('${ctx.session.user.biography}',${ctx.session.user.idUser},'${ctx.session.user.image}')`).then(res=>{
                                                ctx.telegram.sendPhoto(chatId,{ source: ctx.session.user.image })
                                                    .then(()=>{
                                                        ctx.telegram.sendMessage(chatId,` ${ctx.session.user.biography}`)
                                                    })
                                                ctx.replyWithHTML(`Ваша ссылка-приглашение: https://t.me/+Y5oztxFrdYE5MjEy`).then(()=>{
                                                    ctx.scene.leave()
                                                })
                                            })
                                        });
                                    })
                                })
                            })
                        },1000)
                    })
                })
            }else{
                ctx.replyWithHTML(`Пожалуйста пришлите своё фото`,Markup.removeKeyboard())
            }
        } catch (err){
            console.log(err)
        }
    },
)