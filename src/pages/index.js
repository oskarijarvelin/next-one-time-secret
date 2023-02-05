import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [sent, setSent] = useState(false);

  const handleSubmitForm =
    (e) => {
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
      <main className="container mx-auto w-full max-w-lg my-20 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-3xl mb-8 font-bold">Lähetä salaisuus</h1>
        <p>
          Tässä lomakkeella voit lähettää tietoturvallisesti tunnuksia
          Oskarille. Salaisuudet lähetetään salattuina, niiden lukeminen vaatii
          kirjautumisen ja ne vanhentuvat.
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
      </main>
    </>
  );
}
