import * as Twitter from 'twitter'

export class TwitterService {
  private twitterClient

  constructor() {
    this.twitterClient = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    })
  }

  fetchAllSafaricomTweets(): void {
    const safaricomCareStream = this.twitterClient.stream('user', { q: '@Safaricom_Care' })

    safaricomCareStream.on('data', (event) => {
      // if (event.in_reply_to_screen_name === 'Safaricom_Care')
      console.log(event)
    })

    safaricomCareStream.on('error', (error) => {
      console.log('error occured')
      console.log(error)
    })

    // const safaricomPlcStream = this.twitterClient.stream('user', { q: '@SafaricomPLC' })

    // safaricomPlcStream.on('data', (event) => {
    //   // if (event.in_reply_to_screen_name === 'SafaricomPLC ')
    //   console.log(event)
    // })

    // safaricomPlcStream.on('error', (error) => {
    //   console.log('error occured')
    //   console.log(error)
    // })
  }
}