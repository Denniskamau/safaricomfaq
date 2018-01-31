# Safaricom FAQ
Node JS chatbot to interface with safaricom website frequently asked questions

## Setup
### Microsoft
- Create a microsoft account that can be used to login to azure, and can access microsoft services - https://www.microsoft.com/en-us/.
- Use that account to create a bot on https://dev.botframework.com/bots/provision.
- Please take note and record of the following:

  - ``` Microsoft App Id``` 

  - ``` Microsoft App Password```
- Create an account on https://qnamaker.ai/.
  - Create a new service
  - Add a website endpoint for a FAQ page
  - Click on save and train
  - Note the following
    - ``` QNA_SERVICE_ID```
    - ``` QNA_SUBSCRIPTION_ID```

### Tools
- Download bot emulator from https://github.com/Microsoft/BotFramework-Emulator/releases.

### Code
- Clone the repo

```
$ git clone https://github.com/JamesNyamu/safaricomfaq.git
```

- Add microsoft credentials and qna maker credentials on the .env file

### Application
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
