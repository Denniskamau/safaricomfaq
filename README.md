# Safaricom FAQ
Node JS chatbot to interface with safaricom website frequently asked questions

## Setup
### Microsoft
- Create a microsoft account that can be used to login to azure, and can access microsoft services - https://www.microsoft.com/en-us/.
- Use that account to create a bot on https://dev.botframework.com/bots/provision.
- Choose the first option, webchat bot, and fill in the required details
- In the bot template tab, choose node and basic template
- After deployment, go to application settings and take note and record of the following:

  - ``` Microsoft App Id``` 

  - ``` Microsoft App Password```
- Create an account on https://qnamaker.ai/.
  - Create a new service
  - Add a website endpoint for a FAQ page
  - Click on save and train
  - Click on publish
  - Note the following. In POST, in between knowledgebases and generate answer is the
    - ``` QNA_SERVICE_ID```
  - The Ocp-Apim-Subscription-Key is the
    - ``` QNA_SUBSCRIPTION_ID```
  - In the repo this will be entered in the .env

### Tools
- Download bot emulator from https://github.com/Microsoft/BotFramework-Emulator/releases.
- Install nodejs from https://nodejs.org/en/download/current/
- Install yarn from https://yarnpkg.com/lang/en/docs/install/.

### Code
- Clone the repo

```
$ git clone https://github.com/JamesNyamu/safaricomfaq.git
```

- Add microsoft credentials and qna maker credentials on the .env file

### Application
- Navigate to the root of the repo
- Run
```
$ yarn
```
to install the package dependencies
- run
```
$ yarn start:dev
```
- Makes sure the app is running on the correct port default is 
  ```
  http://localhost:{port}
  ```
- Open bot emulator, enter the address on which the app is running
  ```
  http://localhost:{port}/api/messages
  ```
- Click on connect
- You can now interact with the bot
