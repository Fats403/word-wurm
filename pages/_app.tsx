import React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { FirebaseProvider } from "../src/contexts/FirebaseContext";
import { ToastProvider } from "../src/contexts/ToastContext";
import { TourProvider } from "@reactour/tour";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TourProvider steps={[]}>
      <ToastProvider>
        <FirebaseProvider>
          <Component {...pageProps} />
        </FirebaseProvider>
      </ToastProvider>
    </TourProvider>
  );
}

export default MyApp;
