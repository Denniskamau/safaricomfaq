import * as Twitter from 'twit'

import { QnAMaker } from './QnAMaker'

export class TwitterService {
  private twitterClient

  private qnaMaker: QnAMaker

  constructor() {
    this.twitterClient = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token: process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    })
    this.qnaMaker = new QnAMaker()
  }

  fetchAllSafaricomTweets(): void {
    const safaricomCareTweetToStream = this.twitterClient.stream('statuses/filter', { track: '@Safaricom_Care' })

    safaricomCareTweetToStream.on('tweet', async (tweet) => {
      const userQueryResponse = await this.qnaMaker.getResponse(tweet.text)

      if (userQueryResponse !== 'I cannot understand what you are saying' && userQueryResponse !== 'Oops!! An error occured.') {
        console.log(`${tweet.text} => ${userQueryResponse}`)

        // const response = await this.twitterClient.post('statuses/update', { in_reply_to_status_id: tweet.id_str, status: `@${tweet.user.screen_name} ${userQueryResponse}\n PS: This is a bot message.` })
        // console.log(response.data.text)
      }
    })

    this.twitterClient.get('statuses/user_timeline', { screen_name: '@Safaricom_Care' }, (error, safaricomTweets) => {
      if (error) {
        console.log(error)
        return
      }

      safaricomTweets.forEach(safaricomTweet => {
        if (safaricomTweet.in_reply_to_status_id_str) {
          this.twitterClient.get('statuses/show', { id: `${safaricomTweet.in_reply_to_status_id_str}` }, (error, originalTweetToSafaricom) => {
            if (error) {
              console.log(error)
              return
            }

            if (originalTweetToSafaricom.in_reply_to_status_id_str) {
              return
            }

            // console.log(safaricomTweet)
            // console.log(`From: @${originalTweetToSafaricom.user.screen_name} ${originalTweetToSafaricom.text}`)
            console.log(originalTweetToSafaricom.text)
            // console.log(`===>${tweet.text}`)
            console.log(`   ${safaricomTweet.text}`)
            console.log('\n')
          })
        }
      })
    })

    // safaricomCareTweetFromStream.on('tweet', async (tweet) => {
    //   console.log(tweet)
    // })
  }
}