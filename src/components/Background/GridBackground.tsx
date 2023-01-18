import React from "react";
import styles from "./GridBackground.module.css";

const GridBackground = () => {
  return (
    <div className="absolute min-h-screen z-0 w-full h-full">
      <div className={`${styles.gridBg} ${styles.gridBa} ${styles.anim}`}>
        <div className={styles.inner}></div>
      </div>
    </div>
  );
};

export default GridBackground;
