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
		const padTop = document.getElementById("limitsPadTop");
		const padBot = document.getElementById("limitsPadBot");

		const playerPad = document.getElementById("playerPad");
		const opponentPad = document.getElementById("opponentPad");

		const elem = document.getElementById("ball");
		let ball_pos_x:number = 0;
		let ball_pos_y:number = 0;

		setIsRunning(true);
		if (elem !== null) {
			ball_pos_x = elem.offsetLeft;
			ball_pos_y =  elem.offsetTop;
		}

		const movement = () => {
			if (ball_pos_x === target.x && ball_pos_y === target.y)
			{
				setIsRunning(false);
				clearInterval(id);
			}
			else
			{
				if (ball_pos_x !== target.x) {
					if (ball_pos_x < target.x) {
						if (target.x - ball_pos_x >= 10) {
							ball_pos_x += 10;
						} else {
							ball_pos_x++;
						}
					}
					else {
						if (target.x - ball_pos_x <= 10) {
							ball_pos_x -= 10;
						} else {
							ball_pos_x--;
						}
					}
				}
				if (ball_pos_y !== target.y) {
					if (ball_pos_y < target.y) {
						if (target.y - ball_pos_y >= 10) {
							ball_pos_y += 10;
						} else {
							ball_pos_y++;
						}
					}
					else {
						if (target.y - ball_pos_y <= 10) {
							ball_pos_y -= 10;
						} else {
							ball_pos_y--;
						}
					}
				}
				if (elem != null) {
					elem.style.top = ball_pos_y + "px";
					elem.style.left = ball_pos_x + "px";

					if (padTop !== null) {
						padTop.style.left = ball_pos_x - 80 + "px";
					}
					if (padBot !== null) {
						padBot.style.left = ball_pos_x - 80 + "px";
					}

					if (playerPad !== null) {
						playerPad.style.top = ball_pos_y - 25 + "px";
					}
					if (opponentPad !== null) {
						opponentPad.style.top = ball_pos_y - 25 + "px";
					}
				}
			}
		};

		id = setInterval(movement, 0);
	};

	const move = () => {
		const	target:Pos = {x:Math.floor(Math.random() * (window.innerWidth - 160) + 75), y:Math.floor(Math.random() * (window.innerHeight - 50))};

		moveImgToPos(target);
	}

	return (
		<div>
			<div className={styles.playerPad} id="playerPad">
				<Image
					src="/PlayerPad.png"
					width={14}
					height={73}
				/>
			</div>
			<div className={styles.opponentPad} id="opponentPad">
				<Image
					src="/PlayerPad.png"
					width={14}
					height={73}
				/>
			</div>
			<div className={styles.limitsPadTop} id="limitsPadTop">
				<Image
					src="/BottomBorderPad.png"
					width={218}
					height={14}
				/>
			</div>
			<div className={styles.limitsPadBot} id="limitsPadBot">
				<Image
					src="/BottomBorderPad.png"
					width={218}
					height={14}
				/>
			</div>
			<div onMouseEnter={move} className={styles.ball} id="ball">
					<Image
						src="/favicon.ico"
						width={50}
						height={50}
					/>
			</div>
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