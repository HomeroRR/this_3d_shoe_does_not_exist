import Head from "next/head";
import MainBanner from "../src/components/banner/MainBanner";
import type { NextPage } from "next";
import MainDemo from "../src/components/demo/MainDemo";

const Home: NextPage = () => (
  <>
    <Head>
      <title>This 3D shoe does not exist</title>
      <meta
        name="description"
        content="Generate a new 3D shoe using 3D GAN. Use online demo and generate your own shoe."
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main>
      <MainBanner />
      <MainDemo />
    </main>
  </>
);

export default Home;
