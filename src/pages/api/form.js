import { encode as base64_encode } from "base-64";

export default function handler(req, res) {
  const body = req.body;

  if (!body.salaisuus) {
    return res.status(400).json({ data: "Salaisuus puuttuu" });
  }

  let ots = {
    username: process.env.OTS_USERNAME,
    api_token: process.env.OTS_API_TOKEN,
    passphrase: process.env.OTS_PASSPHRASE,
    recipient: process.env.OTS_RECIPIENT,
    ttl: process.env.OTS_TTL,
  };

  fetch(
    `https://onetimesecret.com/api/v1/share?secret=${encodeURI(body.salaisuus)}&passphrase=${ots.passphrase}&ttl=${ots.ttl}&recipient=${ots.recipient}`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${base64_encode(
          `${ots.username}:${ots.api_token}`
        )}`,
      },
    }
  )
    .then((resp) => resp.json())
    .then((resp) => {
      console.log(resp);
      if (resp?.custid === ots.username) {
        console.log(resp?.message);
        res.status(201).json({ salaisuus: `${body.salaisuus}` });
        fetch(`https://api.sendgrid.com/v3/mail/send`, {
          method: "POST",
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          },
          body: JSON.stringify({
            "personalizations": [
              {
                "to": [
                  {
                    "email": `${ots.recipient}`,
                  },
                ],
              },
            ],
            "from": { "email": "salaisuus@oskarijarvelin.fi" },
            "subject": "Uusi salaisuus vastaanotettu",
            "content": [
              {
                "type": "text/html",
                "value": `<a href="https://salaisuus.oskarijarvelin.fi/lue/${resp.secret_key}" target="_blank">https://salaisuus.oskarijarvelin.fi/lue/${resp.secret_key}</a>`,
              },
            ],
          }),
        })
          .then((respo) => respo.json())
          .then((respo) => {
            console.log(respo);
          });
      } else {
        res
          .status(400)
          .json({ data: "Salaisuuden lähettämisessä tapahtui virhe" });
      }
    });
}
