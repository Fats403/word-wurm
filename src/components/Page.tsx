import React from "react";
import Head from "next/head";
import { PageProps } from "../types";

const Page = ({ children, title = "" }: PageProps): JSX.Element => (
  <div className="flex min-h-screen flex-col items-center justify-center">
    <Head>
      <title>{title}</title>
    </Head>
    <div className="z-10">{children}</div>
  </div>
);

export default Page;
