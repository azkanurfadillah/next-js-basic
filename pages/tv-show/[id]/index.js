import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../../../styles/Home.module.css'

const mdbapi = "https://api.themoviedb.org/3/tv/popular?api_key=c3028a5455afc66958796057fb3b0d97&language=en-US&page=1"

// This function gets called at build time
export async function getStaticPaths() {
    const res = await fetch(mdbapi)
    const data = await res.json()
    // console.log("static path", { data: data?.results })
    if (!data?.results) {
        return {
            paths: [],
            fallback: true,
        }
    }

    // Get the paths we want to pre-render based on posts
    const paths = data?.results.map((d) => ({
        params: { id: `${d.id}` },
    }))


    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: false }

    // return {
    //     // Only `/posts/1` and `/posts/2` are generated at build time
    //     paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
    //     // Enable statically generating additional pages
    //     // For example: `/posts/3`
    //     fallback: true,
    //   }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
    // params contains the post `id`.
    // If the route is like /posts/1, then params.id is 1
    const res = await fetch(`https://api.themoviedb.org/3/tv/${params?.id}?api_key=c3028a5455afc66958796057fb3b0d97&language=en-US&page=1`)
    const post = await res.json()
    console.log({ params })
    // Pass post data to the page via props
    return {
        props: { post },

        // Re-generate the post at most once per  3 seconds
        // if a request comes in
        revalidate: 3, //An optional amount in seconds after which a page re-generation can occur (defaults to: false or no revalidating). More on Incremental Static Regeneration
    }
}

const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

const toBase64 = (str) =>
    typeof window === 'undefined'
        ? Buffer.from(str).toString('base64')
        : window.btoa(str)

export default function TvShowById({ post }) {
    console.log({ post })
    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Link className={styles.description} href="/" passHref>
                <a style={{ fontWeight: "bold", color: "#0070f3" }} > back </a>
            </Link>
            <main className={styles.main} style={{ width: "80%" }}>
                <h1 className={styles.title}>
                    {post?.original_name}
                </h1>
                <p className={styles.description}>
                    {post?.overview}
                </p>
                <div style={{ position: 'relative', width: '500px', height: '700px', margin: "auto" }}>
                    <Image
                        layout="fill"
                        objectFit="fill"
                        quality={100}
                        src={`https://image.tmdb.org/t/p/w500/${post?.poster_path}`}
                        alt="Vercel Logo"
                        placeholder="blur"
                        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                    />
                </div>

            </main>

            <footer className={styles.footer}>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{' '}
                    <span className={styles.logo}>
                        <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
                    </span>
                </a>
            </footer>
        </div>
    )
}
