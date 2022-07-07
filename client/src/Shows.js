import {React, useState, useEffect} from 'react'
import axios from 'axios'

export default function Shows(accessToken, SpotifyApi) {
    const [items, setItems] = useState([]);

    useEffect(() => {
    axios.get('https://api.spotify.com/v1/me/episodes',{headers: 
        {"Authorization" : `Bearer ${accessToken.accessToken}`, 'Content-Type': 'application/json'}
      }).then(res=>{
        console.log(res);
        setItems(
            res.data.items.map(track =>{
            const smallestAlbumImage = track.episode.images.reduce(
              (smallest, image)=>{
                if (image.height < smallest.height) return image
                return smallest
              }, track.episode.images[0])
            return {
              desc: track.episode.description,
              title: track.episode.name,
              uri: track.episode.id,
              episodeUri: smallestAlbumImage.url
            }
  
          }))
        //setItems(res)
      })
    },[accessToken])
  return (
    <div>
        {items.map(item => (
            <div className="d-flex m-2 align-items-center" style={{cursor: 'pointer'}}>
            <img src={item.episodeUri} style={{height:'64px',width:'64px'}}/>
            <div className="mx-3"> 
                <div>{item.title}</div>
                <div className='text-muted'>{item.desc}</div>
            </div>
        </div>
      ))}
    </div>
  )
}
