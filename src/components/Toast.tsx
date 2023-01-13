import React, { useCallback, useContext, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { GameContext } from "../contexts/GameContext";
import { GameContextType } from "../types";

const variants = {
  open: { opacity: 1, y: 0 },
  closed: { opacity: 0, y: 20 },
};

const Toast = (): JSX.Element => {
  const refTimer = useRef<number | null>(null);
  const { toast, showToast } = useContext(GameContext) as GameContextType;

  const clearToast = useCallback(() => {
    showToast({ ...toast, visible: false });

    if (refTimer.current) {
      clearTimeout(refTimer.current);
      refTimer.current = null;
    }
  }, [showToast, toast]);

  useEffect(() => {
    () => clearToast();
  }, [clearToast, refTimer]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={toast.visible ? "open" : "closed"}
      onAnimationComplete={() => {
        refTimer.current = window.setTimeout(() => {
          clearToast();
        }, toast.duration);
      }}
      variants={variants}
      id="toast"
      className=" fixed bottom-0 flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
        <svg
          aria-hidden="true"
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          ></path>
        </svg>
        <span className="sr-only">Check icon</span>
      </div>
      <div className="ml-3 text-sm font-normal">{toast.message}</div>
      <button
        onClick={() => clearToast()}
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        data-dismiss-target="#toast-success"
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <svg
          aria-hidden="true"
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
    </motion.div>
  );
};

export default Toast;