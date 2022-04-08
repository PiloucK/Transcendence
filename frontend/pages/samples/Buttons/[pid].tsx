import { ReactElement } from 'react'
import SampleLayout from '../../../src/layouts/samplesLayout'
import ButtonInterface from '../../../src/components/Buttons/ButtonsInterface'
import ButtonIncrement from '../../../src/components/Buttons/ButtonsIncrement'
import { useRouter } from 'next/router'

function getComponent(pid: string | string[] | undefined){
	if (pid === 'ButtonsIncrement'){
		return <ButtonIncrement />
	}
	else if (pid === 'ButtonsInterface'){
		return <ButtonInterface />
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