import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { encode as base64_encode } from "base-64";

export default function Salaisuus({ data, year }) {
  const [login, setLogin] = useState(false);

  const handleLoginForm = (e) => {
    e.preventDefault();

    const lomake = {
      email: e.target.email.value,
      password: e.target.password.value,
    }

    const response = fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lomake),
    })
    .then((response) => response.json())
    .then((response) => {
      if (response?.login === true) {
        setLogin(true);
      }
    });

  };

  return (
    <>
      <Head>
        <title>Lähetä salaisuus Oskarille</title>
        <meta
          name="description"
          content="Lähetä salaisuus Oskarille tietoturvallisesti."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container-lg px-1">
        <div className="mx-auto w-full max-w-lg my-20 bg-white shadow-md rounded px-8 pt-8 pb-8 mb-4">
          {login &&
            <>
              <h1 className="text-3xl mb-8 font-bold">Salaisuus:</h1>
              {data.value &&
                  <p>{data.value}</p>
              }
              {data.message &&
                  <p>Tämä salaisuus on jo luettu.</p>
              }
              <p className="mt-4 text-blue-900 font-bold">
                  <Link href="/">&larr; Takaisin etusivulle</Link>
              </p>
            </>
          }
          {!login &&
            <>
              <h1 className="text-3xl mb-8 font-bold">Kirjaudu sisään</h1>

              <form className="my-12" onSubmit={handleLoginForm}  >
                <div className="mb-6">
                  <label className="block font-bold mb-2" htmlFor="email">
                    Sähköposti
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Sähköpostiosoittesi"
                    className="w-full shadow-md px-2 py-2 rounded-lg border-gray-300 text-gray-600"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block font-bold mb-2" htmlFor="password">
                    Salasana
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Salasanasi"
                    className="w-full shadow-md px-2 py-2 rounded-lg border-gray-300 text-gray-600"
                    required
                  />
                </div>
                <button className="w-full shadow-md rounded-lg py-2 px-4 bg-green-600 text-white font-semibold">
                  Kirjaudu sisään
                </button>
              </form>

              <p className="mt-4 text-blue-900 font-bold">
                  <Link href="/">&larr; Takaisin etusivulle</Link>
              </p>
            </>
          }
        </div>
        <p className="text-center text-sm text-gray-600">
          &copy;
          {' '}{year}{' '}
          <Link href="https://oskarijarvelin.fi">Oskari Järvelin</Link>
        </p>
      </main>
    </>
  );
}

export async function getServerSideProps(ctx) {
    const year = await new Date().getFullYear();
    const { id } = ctx.query;
    let ots = {
        username: process.env.OTS_USERNAME,
        api_token: process.env.OTS_API_TOKEN,
        passphrase: process.env.OTS_PASSPHRASE,
    };

    const res = await fetch(
        `https://onetimesecret.com/api/v1/secret/${id}?passphrase=${ots.passphrase}`,
        {
            method: "POST",
            headers: {
              Authorization: `Basic ${base64_encode(
                  `${ots.username}:${ots.api_token}`
              )}`,
            },
        }
    );
    const data = await res.json();

    return { props: { data, year } };
}
