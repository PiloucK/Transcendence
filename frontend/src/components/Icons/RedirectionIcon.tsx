import Link from 'next/link'
import Image, { StaticImageData } from 'next/image'
import React from 'react'
import styles from '../../styles/Home.module.css'

// Declaring the interface for the props
export interface RedirectionIconProps {
	src:StaticImageData,
	href:string,
}

export function RedirectionIcon(props:RedirectionIconProps)
{
	return (
		<Link href={props.href}>
			<div className={styles.icon}>
				<Image
					src = {props.src}
					layout = {'fill'}
				/>
			</div>
		</Link>
	);
}