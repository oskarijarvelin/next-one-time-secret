import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function Home({ year }) {
  const [sent, setSent] = useState(false);

  const handleSubmitForm = (e) => {
    e.preventDefault();

    const lomake = {
      salaisuus: e.target.salaisuus.value,
    }

    setSent(true);

    const response = fetch('/api/form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lomake),
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
      <main className="container-lg px-2">
        <div className="mx-auto w-full max-w-lg my-20 bg-white shadow-md rounded px-8 pt-8 pb-8 mb-4">
          <h1 className="text-3xl mb-6 font-bold">Lähetä salaisuus Oskarille</h1>
          <p>
            Tässä lomakkeella voit lähettää minulle tietoturvallisesti mm. käyttäjätunnuksia, salasanoja ja muita luottamuksellisia tietoja.
            Salasanasuojattu linkki tietojen lukemiseen lähetetään suoraan laitteilleni.
            Tiedot ovat luettavissa vain yhden kerran 48 tunnin sisällä lähettämisestä.
          </p>
          {!sent &&
            <form className="mt-12" onSubmit={handleSubmitForm} /*action="/api/form" method="POST"*/ >
              <div className="mb-6">
                <label className="block font-bold mb-2" htmlFor="salaisuus">
                  Salaisuuden sisältö
                </label>
                <textarea
                  id="salaisuus"
                  name="salaisuus"
                  placeholder="Salasana: h4uk10nk4l4"
                  rows={4}
                  className="w-full shadow-md px-2 py-1 rounded-lg border-gray-300 text-gray-600"
                  required
                ></textarea>
              </div>
              <button className="w-full shadow-md rounded-lg py-2 px-4 bg-green-600 text-white font-semibold">
                Lähetä salaisuus
              </button>
            </form>
          }
          {sent &&
            <div>
              <div className="rounded-lg mt-8 py-2 text-green-600">
                <p className="font-bold text-xl">
                  Salaisuus lähetetty onnistuneesti.
                </p>
              </div>
              
                
              <button className="w-full shadow-md rounded-lg mt-4 py-2 px-4 bg-green-600 text-white font-semibold" onClick={() => setSent(false)}>
                Lähetä toinen salaisuus
              </button>
            </div>
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

export async function getServerSideProps() {
  const year = await new Date().getFullYear();
  return { props: { year } }
}