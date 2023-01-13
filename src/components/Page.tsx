import React from "react";
import Head from "next/head";
import { PageProps } from "../types";

const Page = ({ children, title = "" }: PageProps): JSX.Element => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-gray-200">
    <Head>
      <title>{title}</title>
    </Head>
    {children}
  </div>
);

export default Page;
