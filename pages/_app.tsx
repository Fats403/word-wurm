import React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { FirebaseProvider } from "../src/contexts/FirebaseContext";
import { ToastProvider } from "../src/contexts/ToastContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ToastProvider>
      <FirebaseProvider>
        <Component {...pageProps} />
      </FirebaseProvider>
    </ToastProvider>
  );
}

export default MyApp;
