import { encode as base64_encode } from "base-64";

function send_email(key, recipient) {
  fetch(`https://api.sendgrid.com/v3/mail/send`, {
    "method": "POST",
    "headers": {
      "Content-type": "application/json",
      "Authorization": `Bearer ${process.env.SENDGRID_API_KEY}`,
    },
    "body": JSON.stringify({
      "personalizations": [
        {
          "to": [
            {
              "email": `${recipient}`,
            },
          ],
        },
      ],
      "from": { "email": "salaisuus@oskarijarvelin.fi" },
      "subject": "Uusi salaisuus vastaanotettu",
      "content": [
        {
          "type": "text/html",
          "value": `<a href="https://salaisuus.oskarijarvelin.fi/lue/${key}" target="_blank">https://salaisuus.oskarijarvelin.fi/lue/${key}</a>`,
        },
      ],
    }),
  });
}

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
    `https://onetimesecret.com/api/v1/share?secret=${encodeURI(
      body.salaisuus
    )}&passphrase=${ots.passphrase}&ttl=${ots.ttl}&recipient=${ots.recipient}`,
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
      if (resp?.custid === ots.username) {
        send_email(resp.secret_key, ots.recipient);
        res.status(201).json({ success: true });
      } else {
        res
          .status(400)
          .json({ data: "Salaisuuden lähettämisessä tapahtui virhe" });
      }
    });
}
