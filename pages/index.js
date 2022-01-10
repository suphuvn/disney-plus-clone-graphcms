import { gql, GraphQLClient } from 'graphql-request'
import Link from 'next/Link'
import Image from 'next/Image'
import Navbar from '../components/NavBar'
import Section from '../components/Section'
import disneylogo from '../public/images/viewers-disney.png'
import starwarslogo from '../public/images/viewers-starwars.png'
import marvellogo from '../public/images/viewers-marvel.png'
import nationallogo from '../public/images/viewers-national.png'
import pixarlogo from '../public/images/viewers-pixar.png'

export const getStaticProps = async () => {
  const url = process.env.ENDPOINT
  const graphQLClient = new GraphQLClient(url, {
    headers: {
      "Authorization" : process.env.GRAPH_CMS_TOKEN
    }
  })
  const videosquery = gql`
  query {
    videos {
      createdAt,
      id,
      title,
      description,
      seen,
      slug,
      tags,
      thumbnail {
        url
      },
      mp4 {
        url
      }
    }
  }
  `

  const accountQuery = gql`
  query {
    account(where: {id:"ckwz6985k0lfy0b86xx2ckwf9"}) {
      username
      avatar {
        url
      }
    }
  }`

  const data = await graphQLClient.request(videosquery)
  const videos = data.videos
  const accountData = await graphQLClient.request(accountQuery)
  const account = accountData.account

  return {
    props: {
      videos,
      account,
    }
  }
}

const Home = ({ videos, account }) => {
  const randomVideo = (videos) => {
    return videos[Math.floor(Math.random() * videos.length)]
  }

  const filterVideos = (videos, genre) => {
    return videos.filter((videos) => videos.tags.includes(genre))
  }

  const unSeenVideos = (videos) => {
    return videos.filter(video => video.seen == false || video.seen == null)
  }

  return (
    <>
      <Navbar account={account}/>
      <div className="app">
        <div className="main-video">
          <img src={randomVideo(videos).thumbnail.url}
          alt={randomVideo(videos).title}/>
        </div>
        <div className="video-feed">
          <Link href="#disney"><div className="franchise" id="disney">
            <Image src={disneylogo}></Image>
            </div>
          </Link>
          <Link href="#star-wars"><div className="franchise" id="star-wars">
            <Image src={starwarslogo}></Image>
            </div>
          </Link>
          <Link href="#marvel"><div className="franchise" id="marvel">
            <Image src={marvellogo}></Image>
            </div>
          </Link>
          <Link href="#nat-geo"><div className="franchise" id="nat-geo">
            <Image src={nationallogo}></Image>
            </div>
          </Link>
          <Link href="#pixar"><div className="franchise" id="pixar">
            <Image src={pixarlogo}></Image>
            </div>
          </Link>
        </div>
          <Section genre={'Recommended For You'} videos={filterVideos(videos, 'family')}/>
          <Section genre={'Family'} videos={filterVideos(videos, 'family')}/>
          <Section genre={'Action'} videos={filterVideos(videos, 'action')}/>
          <Section genre={'Adventure'} videos={filterVideos(videos, 'adventure')}/>
          <Section id="disney" genre={'Disney'} videos={filterVideos(videos, 'disney')}/>
          <Section id="star-wars" genre={'Star Wars'} videos={filterVideos(videos, 'star-wars')}/>
          <Section id="marvel" genre={'Marvel'} videos={filterVideos(videos, 'marvel')}/>
          <Section id="nat-geo" genre={'National Geographics'} videos={filterVideos(videos, 'national-geographics')}/>
          <Section id="pixar" genre={'Pixar'} videos={filterVideos(videos, 'pixar')}/>
      </div>
    </>
  )
}

export default Home