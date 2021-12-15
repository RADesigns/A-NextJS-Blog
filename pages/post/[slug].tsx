import Link from 'next/link'
import { useRouter } from 'next/router'

import styles from '../../styles/Home.module.scss'
const { BLOG_URL, CONTENT_API_KEY } = process.env

async function getPost(slug: string) {
    const res = await fetch(`${BLOG_URL}/ghost/api/v3/content/posts/slug/${slug}/?key=${CONTENT_API_KEY}&fields=title,slug,html`)
      .then((res) => res.json())
      console.log(res)
    const post = res.posts
    
    return post
}

// Ghost CMS Request
export const getStaticProps = async ({ params }) => {
    
    const post = await getPost(params.slug)
    
    return {
        props: { post }
    }
}

// hello-world - on first request = Ghost CMS call is made (1)
// hello-world - on other requests ... = filesystem is called (1M)
export const getStaticPaths = () => {
    // paths -> slugs which are allowed
    // fallback -> 
    return {
        paths: [],
        fallback: true
    }
}

type Post = {
    title: string,
    html: string,
    slug: string
}

const Post: React.FC<{post: Post}> = (props) => {
    const { post } = props
    
    const router = useRouter()

    if(router.isFallback) {
        return <h1>Loading...</h1>
    }

    return ( 
        <div className={styles.container} >
            <Link href="/"><a>Go back</a></Link>

            <h1>{post[0].title}</h1>
            <div dangerouslySetInnerHTML={{__html: post[0].html}}></div>
        </div>
    );
}
 
export default Post