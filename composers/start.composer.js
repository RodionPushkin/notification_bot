const { Composer, Markup} = require('telegraf')
const composer = new Composer()
composer.start(async (ctx) => {
    try {
        ctx.scene.enter('signup')
    } catch (err) {
        console.log(err)
    }
})
module.exports = composer