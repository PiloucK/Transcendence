import styles from "../../styles/animation.module.css";
import Button from "../Buttons/ButtonsInterface";
import { ReactElement, useState } from 'react'
import SampleLayout from '../../layouts/samplesLayout'
import Image from 'next/image'

interface Pos {
	x:number,
	y:number,
}

const Page = () => {
	let id:NodeJS.Timer;
	const	[isRunning, setIsRunning] = useState(false);

	const moveImgToPos = (target:Pos) => {
		const elem = document.getElementById("round");
		let pos_x:number = 0;
		let pos_y:number = 0;

		setIsRunning(true);
		if (elem !== null) {
			pos_x = elem.offsetLeft;
			pos_y =  elem.offsetTop;
		}

		const move = () => {
			if (pos_x === target.x && pos_y === target.y)
			{
				setIsRunning(false);
				clearInterval(id);
			}
			else
			{
				if (pos_x !== target.x) {
					if (pos_x < target.x) {
						if (target.x - pos_x >= 30) {
							pos_x += 30;
						} else if (target.x - pos_x >= 10) {
							pos_x += 10;
						} else {
							pos_x++;
						}
					}
					else {
						if (target.x - pos_x <= 30) {
							pos_x -= 30;
						} else if (target.x - pos_x <= 10) {
							pos_x -= 10;
						} else {
							pos_x--;
						}
					}
				}
				if (pos_y !== target.y) {
					if (pos_y < target.y) {
						if (target.y - pos_y >= 30) {
							pos_y += 30;
						} else if (target.y - pos_y >= 10) {
							pos_y += 10;
						} else {
							pos_y++;
						}
					}
					else {
						if (target.y - pos_y <= 30) {
							pos_y -= 30;
						} else if (target.y - pos_y <= 10) {
							pos_y -= 10;
						} else {
							pos_y--;
						}
					}
				}
				if (elem != null) {
					elem.style.top = pos_y + "px";
					elem.style.left = pos_x + "px";
				}
			}
		};

		id = setInterval(move, 0);
	};

	const move = () => {
		const	target:Pos = {x:Math.floor(Math.random() * (window.screen.availWidth - (window.outerWidth - window.innerWidth) - 50)), y:Math.floor(Math.random() * (window.screen.availHeight - (window.outerHeight - window.innerHeight) - 50))};

			moveImgToPos(target);
	}

	return (
		<div onMouseEnter={move} className={styles.imgContainer} id="round">
				<Image
					src="/favicon.ico"
					width={100}
					height={100}
				/>
		</div>
	);
};

Page.getLayout = function getLayout(page: ReactElement) {
	return (
	  <SampleLayout>
			{page}
	  </SampleLayout>
	)
}

export default Page;