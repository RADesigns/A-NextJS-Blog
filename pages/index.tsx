import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { getHeapCodeStatistics } from 'v8'
import styles from '../styles/Home.module.css'



export const getStaticProps = async ({ params }) => {
  
  return {
    props: { hello:true },
    revalidate: 10 // hit server only once every 10 seconds, else hitting cache
  }
}

const Home: React.FC = (props) => {
  console.log(props)

    
  return (
    <div className={`${styles.container} ${styles.main}`}>
      <h1 className='text-3xl font-bold'>Home Page</h1>
    </div>
  )
}

export default Home