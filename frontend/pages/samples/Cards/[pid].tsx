import { ReactElement } from 'react'
import SampleLayout from '../../../src/layouts/samplesLayout'
import CardInterface from '../../../src/components/Cards/CardsInterface'
import CardHome from '../../../src/components/Cards/CardsHome'
import { useRouter } from 'next/router'

function getComponent(pid: string | string[] | undefined){
	if (pid === 'CardsHome'){
		return <CardHome/>
	}
	else if (pid === 'CardsInterface'){
		return <CardInterface href = '/' />
	}
	return <>No components has been found</>
}

export default function Components() {
  const router = useRouter()
  const { pid } = router.query
  
  return (getComponent(pid))
}


Components.getLayout = function getLayout(page: ReactElement) {
	return (
	  <SampleLayout>
		{page}
	  </SampleLayout>
	)
  }