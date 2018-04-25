import { BotFramework, TwitterCron } from './app'

// const botFrameworkPort = 3000

// const botFramework = new BotFramework().express

// botFramework.listen(botFrameworkPort, error => {
//   if (error) {
//     console.log(error)
//   }

//   return console.log(`Bot Framework running on port ${botFrameworkPort}`)
// })

const twitterCronPort = 3030

const twitterCron = new TwitterCron().express

twitterCron.listen(twitterCronPort, error => {
  if (error) {
    console.log(error)
  }

  return console.log(`Twitter Cron running on port ${twitterCronPort}`)
})
