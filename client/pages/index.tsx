import Head from "next/head";
import MainBanner from "../src/components/banner/MainBanner";
import MainFooter from "../src/components/footer/MainFooter";
import type { NextPage } from "next";

import dynamic from "next/dynamic";
import AttributionSection from "components/content/home/AttributionSection";

const MainDemo = dynamic(() => import("../src/components/demo/MainDemo"), {
  ssr: false,
});

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
      <AttributionSection/>
      <MainFooter />
    </main>
  </>
);

export default Home;
