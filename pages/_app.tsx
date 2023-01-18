import React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { FirebaseProvider } from "../src/contexts/FirebaseContext";
import { ToastProvider } from "../src/contexts/ToastContext";
import { TourProvider } from "@reactour/tour";
import { Exo } from "@next/font/google";
import GridBackground from "../src/components/Background/GridBackground";

const exo = Exo({ subsets: ["latin"] });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TourProvider steps={[]}>
      <ToastProvider>
        <FirebaseProvider>
          <main className={exo.className}>
            <GridBackground />
            <Component {...pageProps} />
          </main>
        </FirebaseProvider>
      </ToastProvider>
    </TourProvider>
  );
}

export default MyApp;
