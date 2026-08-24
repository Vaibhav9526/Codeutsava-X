import React from "react";
import styles from "./pearl-button.module.css";

/* eslint-disable react/prop-types -- TypeScript supplies this component's runtime-safe prop contract. */

export type PearlButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
};

export const PearlButton: React.FC<PearlButtonProps> = ({
  label = "Pearl Button",
  className = "",
  type = "button",
  ...props
}) => {
  return (
    <button
      className={`${styles.pearlButton} ${className}`.trim()}
      type={type}
      {...props}
    >
      <span className={styles.wrap}>
        <span className={styles.content}>
          <span className={styles.glyphIdle} aria-hidden="true">✧</span>
          <span className={styles.glyphActive} aria-hidden="true">✦</span>
          <span>{label}</span>
        </span>
      </span>
    </button>
  );
};
