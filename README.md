# serverless-postmark

Just a dumb little serverless mailer I wrote.

This requires an .env file structured thusly:

```
POSTMARK_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
WHITELIST={\"http:\/\/localhost:3000\":\"testrecipient@mail.com\",\"https:\/\/www.publicsite.com\":\"recipient@mail.com\"}
// ^ escaped json of string:string pairs
POSTMARK_SENDER=sender@mail.com
```

To use, POST to digital ocean serverless function with payload.

```
const submit = ({ name, email, subject, message }: Record<string, string>) => {
  const MAILER_URL = https://faas-nyc1-XXXXXX.doserverless.co/api/v1/namespaces/fn-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/actions/serverless-postmark/send?blocking=true&result=true

  const payload = {
    name, email, subject, message, referer: 'https://some-whitelisted-domain.com'
  }

  const response = await fetch(MAILER_URL, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  })

  console.log(response)
}
```

TODO: This could be secured by using its own API endpoint and including a bearer token. Basic CORS shit would prevent abuse.

However, I want to use this on static sites that don't have an API. A bearer token would necessarily have to be in the client code, so it's effectively useless.

Since the recipients only exist on the DO function, there's no way for an abuser to know where there spam is going to wind up, so it's not really worth their bother to crack this and only be able to pester one individual.
