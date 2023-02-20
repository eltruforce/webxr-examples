import { Box } from "@mantine/core";
import Head from "next/head";

import Navbar from "../navbar";

const Main = ({ children, router }) => {
  return (
    <Box pb={24}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>ElTruforce's WebXR Examples</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar path={router.asPath} />

      <Box>{children}</Box>
    </Box>
  );
};

export default Main;
