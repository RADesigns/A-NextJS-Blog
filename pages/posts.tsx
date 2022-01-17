import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { getHeapCodeStatistics } from 'v8'
import styles from '../styles/Home.module.css'

const { BLOG_URL, CONTENT_API_KEY } = process.env

type Post = {
  title: string,
  slug: string,
  custom_excerpt: string
}

async function getPosts() {
  const res = await fetch(`${BLOG_URL}/ghost/api/v3/content/posts/?key=${CONTENT_API_KEY}&fields=title,slug,custom_excerpt`)
    .then((res) => res.json())
    
    const posts = res.posts
    
    return posts
}


export const getStaticProps = async ({ params }) => {
  const posts = await getPosts()
  
  return {
    props: { posts },
    //revalidate: 10 // hit server only once every 10 seconds, else hitting cache
  }
}

const Posts: React.FC <{ posts: Post[] }> = (props) => {
  
  const { posts } = props
    
  return (
    <div className={`${styles.container} ${styles.main}`}>
      <h1 className='text-3xl font-bold'>Posts</h1>
      <ul>
        {posts.map((post, index) => {
          return <li key={post.slug} className={styles.postitem}>
              <Link href="/post/[slug]" as={`/post/${post.slug}`}>
                <a>{post.title}</a>
              </Link>
            </li>
        })}
      </ul>
    </div>
  )
}

export default Posts