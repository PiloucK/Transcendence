import { ReactElement } from 'react'
import SampleLayout from '../../../layouts/samplesLayout'
import { RedirectionIcon, RedirectionIconProps} from '../../../components/Icons/RedirectionIcon'
import { useRouter } from 'next/router'
import iconSrc from "../../../public/profile_icon.png"

function getComponent(pid: string | string[] | undefined){
	if (pid === 'RedirectionIcon'){
		const props: RedirectionIconProps = {
			src:iconSrc,
			href:'/profile',
		}

		return <RedirectionIcon {...props} />
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