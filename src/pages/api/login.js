export default function handler(req, res) {
  const body = req.body;

  if (!body.email || !body.password) {
    return res.status(401).json({ login: false });
  }

  if ( body.email === process.env.OTS_USERNAME && body.password === process.env.OTS_PASSPHRASE ) {
    return res.status(200).json({ login: true });
  } else {
    return res.status(200).json({ login: false });
  }
}
