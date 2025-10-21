import Image, { type ImageProps } from "next/image";

import styles from "./page.module.css";
import { Button } from "@repo/core/generated/react/Button";
import { Typography } from "@repo/core/generated/react/Typography";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

export default function Home() {
  return (
    <>
      <div style={{ width: "120px" }}>
        <Button variant="outlined-blue" size="M" label="Open alert" />
        <Typography text="Hello, world!" size="16" variant="regular" />
      </div>
    </>
  );
}
