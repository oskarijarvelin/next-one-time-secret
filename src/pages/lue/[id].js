import Head from "next/head";
import Link from "next/link";
import { encode as base64_encode } from "base-64";

export default function Salaisuus({ data }) {
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
        <h1 className="text-3xl mb-8 font-bold">Lue salaisuus</h1>
        {data.value &&
            <p>{data.value}</p>
        }
        {data.message &&
            <p>Tämä salaisuus on jo luettu.</p>
        }
        <p className="mt-4 text-blue-900 font-bold">
            <Link href="/">&larr; Takaisin etusivulle</Link>
        </p>
      </main>
    </>
  );
}

export async function getServerSideProps(ctx) {
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

    return { props: { data } };
}
