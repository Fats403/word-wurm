import React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { FirebaseProvider } from "../src/contexts/FirebaseContext";
import { ToastProvider } from "../src/contexts/ToastContext";
import { TourProvider } from "@reactour/tour";
import { Exo } from "@next/font/google";
import Background from "../src/components/Background/Background";

const exo = Exo({ subsets: ["latin"] });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TourProvider steps={[]}>
      <ToastProvider>
        <FirebaseProvider>
          <style jsx global>{`
            html {
              font-family: ${exo.style.fontFamily};
            }
          `}</style>
          <Background />
          <Component {...pageProps} />
        </FirebaseProvider>
      </ToastProvider>
    </TourProvider>
  );
}

export default MyApp;
