import {useState, useEffect} from 'react'
import { Container, Form } from 'react-bootstrap'
import useAuth from './useAuth'
import SpotifyWebApi from 'spotify-web-api-node'
import TrackSearchResult from './TrackSearchResult'
import Player from './Player'
import axios from 'axios'
import Shows from './Shows'
const SpotifyApi =new SpotifyWebApi({
  clientId: "bd2805db7c36486bb2fcd5f9263e2f7c",
})

export default function Dashboard({code}) {
    const accessToken = useAuth(code)
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [playingTrack, setPlayingTrack] = useState()
    const [lyrics, setLyrics] = useState("")

    function chooseTrack(track){
      setPlayingTrack(track)
      setSearch('')
      setLyrics("")
    }

    useEffect(() => {
      if(!playingTrack)return

      axios.get('http://localhost:3001/lyrics',{
        params: {
          track: playingTrack.title,
          artist: playingTrack.artist
        }
      }).then(res=>{
        //console.log(res.data.lyrics)
        setLyrics(res.data.lyrics)
      })
    },[playingTrack])

    useEffect(() => {
      if(!accessToken) return
      SpotifyApi.setAccessToken(accessToken)
    },[accessToken])
    useEffect(() => {
      if(!search)return setSearchResults([])
      if(!accessToken) return 
      let cancel = false

      // SpotifyApi.searchTracks(search).then(res=>{
      //   if(cancel)return
      //   setSearchResults(
      //     res.body.tracks.items.map(track =>{
      //     const smallestAlbumImage = track.album.images.reduce(
      //       (smallest, image)=>{
      //         if (image.height < smallest.height) return image
      //         return smallest
      //       }, track.album.images[0])
      //     return {
      //       artist: track.artists[0].name,
      //       title: track.name,
      //       uri: track.uri,
      //       albumUrl: smallestAlbumImage.url
      //     }
      //   }))
      // })

      axios.get('https://api.spotify.com/v1/search?type=track&limit=50&q=' + encodeURIComponent('track:"'+search+'"'))
      .then(res=>{
        //console.log(res);
        setSearchResults(
            res.data.items.map(track =>{
            const smallestAlbumImage = track.album.images.reduce(
              (smallest, image)=>{
                if (image.height < smallest.height) return image
                return smallest
              }, track.album.images[0])
            return {
              artist: track.artists[0].name,
              title: track.name,
              uri: track.uri,
              albumUrl: smallestAlbumImage.url
            }
            
          }))
        })
      return ()=>cancel=true
    },[search, accessToken])
    
    


  return <div className="row">
    <div className="col col-lg-2">
      <a href="#">Shows</a>
    </div>
    <div className="col">
      <Container className="d-flex flex-column py-2" style={{height:"100vh"}}>
        <Form.Control 
          type='search' 
          placeholder='Search Songs/Artists' 
          value={search} 
          onChange={e=> setSearch(e.target.value)}
        />
        <div className="flex-grow-1 my-2" style={{overflowY:"auto"}}>
        
          {/* {searchResults.map(track => (
            <TrackSearchResult track={track} key={track.uri} chooseTrack={chooseTrack}/>
          ))}
          {searchResults.length===0 && (
            <div className="text-center" style={{whiteSpace: "pre"}}>
              {lyrics}
            </div>
          )}  */}

          <Shows SpotifyApi={ SpotifyApi } accessToken={accessToken} />
          {/* <MyComponent /> */}
        </div>
        <div> <Player accessToken={accessToken} trackUri={playingTrack?.uri}/> </div>
      </Container>
    </div>
    
  </div>
}
