import { ReactElement } from "react";
import Dock from "./Dock";
import Image from 'next/image'
import styles from '../../styles/Home.module.css'

// import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import FTLogo from "../../public/42logo.png";

export default function DockGuest() {
	return (
	  <Dock>
		<IconButton className={styles.icons} aria-label="Authentification">
			<Image
				src = {FTLogo}
				layout = {'fill'}
			/>
		</IconButton>
	  </Dock>
	);
  }