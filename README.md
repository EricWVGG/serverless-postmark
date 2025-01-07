# serverless-postmark

Just a dumb little serverless mailer I wrote.

This requires an .env file structured thusly:

```
POSTMARK_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
WHITELIST={\"http:\/\/localhost:3000\":\"testrecipient@mail.com\",\"https:\/\/www.publicsite.com\":\"recipient@mail.com\"}
// ^ escaped json of string:string pairs
POSTMARK_SENDER=sender@mail.com
```
