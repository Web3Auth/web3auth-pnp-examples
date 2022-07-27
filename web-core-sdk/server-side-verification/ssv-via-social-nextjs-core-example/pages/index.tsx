import type {NextPage} from 'next'
import dynamic from 'next/dynamic'

const DynamicApp = dynamic(() => import('./App'), {
  ssr: false,
})

const Home: NextPage = () => {
  return <DynamicApp />
}

export default Home
