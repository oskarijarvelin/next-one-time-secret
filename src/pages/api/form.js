import { encode as base64_encode } from "base-64";

function send_push(key) {
  fetch(`https://api.pushbullet.com/v2/pushes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Token": `${process.env.PUSHBULLET_TOKEN}`,
    },
    body: JSON.stringify({
      "body": `Salaisuuden ID on ${key}`,
      "title": "Uusi salaisuus vastaanotettu",
      "url": `https://salaisuus.oskarijarvelin.fi/lue/${key}`,
      "type": "link"
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
        send_push(resp.secret_key);
        res.status(201).json({ success: true });
      } else {
        res
          .status(400)
          .json({ data: "Salaisuuden lähettämisessä tapahtui virhe" });
      }
    });
}
