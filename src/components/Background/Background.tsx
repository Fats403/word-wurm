import React from "react";
import styles from "./Background.module.css";

const Background = () => {
  return (
    <div className="absolute min-h-screen z-0">
      <div className={styles.bg}></div>
      <div className={`${styles.bg} ${styles.bg2}`}></div>
      <div className={`${styles.bg} ${styles.bg3}`}></div>
    </div>
  );
};

export default Background;
