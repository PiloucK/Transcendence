import Card from '../../../components/Cards/CardsInterface'
import SampleLayout from '../../../layouts/samplesLayout'
import { ReactElement } from 'react'

export default function Components() {
	return (
		<Card
			href = '/'
			title = 'HOME'
		/>
	)
}


Components.getLayout = function getLayout(page: ReactElement) {
	return (
	  <SampleLayout>
		{page}
	  </SampleLayout>
	)
  }