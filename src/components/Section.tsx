import { ReactNode, createContext } from "react";
import styles from "./Section.module.css";

export const SectionContext = createContext({
  paperClassName: styles.paper,
});

export function Section(props: {
  children: ReactNode;
  margins?: number;
  paddings?: number;
  radius?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={styles.section}
      style={
        {
          margin: `${(props.margins || 0) * 4}px`,
          padding: `${(props.paddings || 0) * 4}px`,
          "--borderRadius": `${(props.radius || 0) * 16}px`,
          overflow: "hidden",
          ...props.style,
        } as any
      }
    >
      <SectionContext.Provider value={{ paperClassName: styles.paper }}>
        {props.children}
      </SectionContext.Provider>
    </div>
  );
}
