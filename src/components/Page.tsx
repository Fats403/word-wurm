import React from "react";
import Head from "next/head";
import { PageProps } from "../types";

const Page = ({ children, title = "" }: PageProps): JSX.Element => (
  <div
    className="flex flex-col items-center justify-center"
    style={{ minHeight: "100dvh" }}
  >
    <Head>
      <title>{title}</title>
    </Head>
    <div className="z-10">{children}</div>
  </div>
);

export default Page;
