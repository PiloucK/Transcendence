import Card from '../../components/cards'
import styles from '../../styles/sample.module.css'

export default function CardSample() {
	return (
		<div className={styles.center}>
			<Card
				href = '/'
				title = 'Card Title'
				content = 'Card contentttttttttttt'
			/>
		</div>
	)
}