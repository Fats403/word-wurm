import { signInWithPopup } from "firebase/auth";
import React, { useContext } from "react";
import { auth, googleAuthProvider } from "../services/firebase";
import { useRouter } from "next/router";
import {
  ToastContext,
  ToastContextState,
  ToastTypes,
} from "../contexts/ToastContext";
const GoogleButton = (): JSX.Element => {
  const router = useRouter();
  const { showToast } = useContext(ToastContext) as ToastContextState;

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleAuthProvider)
      .then(() => router.push("/play"))
      .catch(() =>
        showToast({ message: "Google sign in failed.", type: ToastTypes.ERROR })
      );
  };

  return (
    <button
      className="relative inline-flex w-64 items-center justify-start inline-block px-5 py-3 overflow-hidden font-bold rounded-full group"
      onClick={() => signInWithGoogle()}
    >
      <span className="absolute top-0 left-0 w-72 h-72 -mt-1 transition-all duration-300 ease-in-out rotate-45 -translate-x-96 -translate-y-24 bg-white opacity-100 group-hover:-translate-x-8"></span>
      <span className="relative w-full flex justify-center items-center text-white transition-colors duration-200 ease-in-out group-hover:text-gray-900">
        <svg
          className="w-4 h-4 mr-2 -ml-1"
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="google"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512"
        >
          <path
            fill="currentColor"
            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
          ></path>
        </svg>
        SIGN IN WITH GOOGLE
      </span>
      <span className="absolute inset-0 border-2 border-white rounded-full"></span>
    </button>
  );
};

export default GoogleButton;
