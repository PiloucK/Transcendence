import { ReactElement } from 'react'
import Animation from '../../../components/Animations/LinearTransition'
import { useRouter } from 'next/router'

function getComponent(pid: string | string[] | undefined){
	if (pid === 'LinearTransition'){
		return <Animation/>
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
	  <>
		{page}
	  </>
	)
  }