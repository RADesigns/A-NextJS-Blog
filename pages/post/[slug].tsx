import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

import styles from '../../styles/Home.module.css'
const { BLOG_URL, CONTENT_API_KEY } = process.env

async function getPost(slug: string) {
    const res = await fetch(`${BLOG_URL}/ghost/api/v3/content/posts/slug/${slug}/?key=${CONTENT_API_KEY}&fields=title,slug,html`)
      .then((res) => res.json())
    const post = res.posts
    
    return post[0]
}

// Ghost CMS Request
export const getStaticProps = async ({ params }) => {
    
    const post = await getPost(params.slug)
    
    return {
        props: { post },
        revalidate: 10 // 10seconds: at most 1 request to ghost CMS in the backend... caching page
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

    const [enableLoadComments, setEnableLoadComments] = useState<boolean>(false);
    
    const router = useRouter()

    if(router.isFallback) {
        return <h1 className='text-3xl font-bold'>Loading...</h1>
    }

    function loadComments () {
        setEnableLoadComments(false);
      
        ;(window as any).disqus_config = function () {
            this.page.url = window.location.href;  // Replace PAGE_URL with your page's canonical URL variable
            this.page.identifier = post.slug; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
        };
        
        const script = document.createElement('script');
        script.src = 'https://ra-blogfolio.disqus.com/embed.js'
        script.setAttribute('data-timestamp', Date.now().toString())

        document.body.appendChild(script);
    }

    return ( 
        <div className={styles.container} >
            <p className={styles.goback}>
                <Link href="/posts"> 
                    <a className='text-3xl font-bold'>Go back</a>
                </Link>
            </p>
            <h1 className='text-3xl font-bold'>{post.title}</h1>
            <div dangerouslySetInnerHTML={{__html: post.html}}></div> {/* TODO: Rethink? this should be fine as I'm the html source */}

            <p className={`text-3xl font-bold ${styles.goback}`} onClick={loadComments}>
                Load Comments
            </p>

            <div id="disqus_thread"></div>
        </div>

        
    );
}
 
export default Post