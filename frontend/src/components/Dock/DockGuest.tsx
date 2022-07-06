import { Dock } from "./Dock";
import Link from "next/link";
import { IconButton, Tooltip } from "@mui/material";
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import FTLogo from "../../public/42logo.png";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export function DockGuest() {
  return (
    <>
      <Dock>
        <Link
          href={`http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.BACKEND_PORT}/auth`}
        >
          <Tooltip title="Login with your 42 account">
            <IconButton className={styles.icons} aria-label="Authentication">
              <Image src={FTLogo} alt="42 logo" layout={"fill"} />
            </IconButton>
          </Tooltip>
        </Link>
      </Dock>
    </>
  );
}
