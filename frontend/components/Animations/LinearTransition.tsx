import "../../styles/animation.module.css";
import { ReactElement } from 'react'
import Image from 'next/image'

const Page = () => {
	let id:NodeJS.Timer;

	const moveImg = () => {
		const elem = document.getElementById("round");
		let pos = 0;
		const rotate = () => {
			if (pos === 350)
			{
				clearInterval(id);
			}
			else
			{
				pos++;
				if (elem != null) {
					elem.style.top = pos + "px";
					elem.style.left = pos + "px";
				}
			}
		};
		id = setInterval(rotate, 1);
	};

	return (
		<>
			<button onClick={moveImg}>move</button>
			<Image
				id="round"
				src="/favicon.ico"
				width={100}
				height={100}
			/>
		</>
	);
};

Page.getLayout = function getLayout(page: ReactElement) {
	return (
		<>
			{page}
		</>
	)
}

export default Page;