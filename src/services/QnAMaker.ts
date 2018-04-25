import axios from 'axios'


export class QnAMaker {
  private host: string = 'https://westus.api.cognitive.microsoft.com/qnamaker/v2.0'
  private path: string = `/knowledgebases/${process.env.QNA_SERVICE_ID}/generateAnswer`

  constructor() { }

  async getResponse(question: string): Promise<string> {
    var options = {
      url: `${this.host}${this.path}`,
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': `${process.env.QNA_SUBSCRIPTION_ID}`,
        'Content-Type': 'application/json'
      },
      data: {
        question
      }
    }

    try {
      const { data } = await axios(options)

      const bestAnswers = data.answers.filter(answer => answer.score > 50)

      if (bestAnswers.answers.length > 0) {
        console.log(data.answers)

        return bestAnswers.answers[0].answer
      }

      return 'I cannot understand what you are saying'
    } catch (error) {
      console.log(error.response.data)

      return 'Oops!! An error occured.'
    }
  }
}