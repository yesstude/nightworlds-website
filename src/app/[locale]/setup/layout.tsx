import { ReactNode } from "react";
import SetupPagesWrapper from "../../../components/setup/SetupPagesWrapper";

export default function SetupLayout(props: { children: ReactNode }) {
  return <SetupPagesWrapper>{props.children}</SetupPagesWrapper>;
}
