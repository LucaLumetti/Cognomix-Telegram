const TelegramBot = require('node-telegram-bot-api');
const Cognomix = require('./cognomix.js')
const token = '463464930:AAEZs6PV-lpFwk3RAdJzAoybGV6qswuuohg';

const Bot = new TelegramBot(token, {polling: true});

Bot.onText(/(.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const idOwner = 28387348
    const name = match[1];
    const opt = {
        parse_mode: 'Markdown'
    }
    console.log(msg.chat)
    if(name === '/start'){
        Bot.sendMessage(chatId, `Send me a surname and i'll tell you everything you need to know :)`, opt)
        Bot.sendMessage(idOwner, `New user started the bot\nName: ${msg.chat.first_name} ${msg.chat.last_name}\nUsername: @${msg.chat.username}`)
        return;
    }

    Cognomix.check_surname(name, (surname, results)=>{
        if(results.length === 0){
            Bot.sendMessage(chatId, `No results for *${surname}* :(`, opt)
            return;
        }
        let total = 0, good = 0, bad = 0
        let msg = ''

        results.forEach((res)=>{
            if(res.region.good){
                good += res.num
                msg += `*${res.ratio}% - ${res.num} in  ${res.region.name}*`
            }else{
                bad += res.num
                msg += `${res.ratio}% - ${res.num} in  ${res.region.name}`
            }
            total += res.num
            msg += '\n'
        })

        good = (100*good/total).toFixed(2)
        bad = (100*bad/total).toFixed(2)
        Bot.sendMessage(chatId, `Result for *${surname}*`, opt)
        .then(()=>Bot.sendMessage(chatId, msg, opt))
        .then(()=>Bot.sendMessage(chatId, `Good: ${good}%\nBad: ${bad}%`, opt))
    })
});
