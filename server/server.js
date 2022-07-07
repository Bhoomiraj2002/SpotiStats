const express=require('express');
const spotifyWebApi= require('spotify-web-api-node');
const cors = require('cors');
const bodyParser = require('body-parser');
const lyricsFinder= require('lyrics-finder');


const app = express();
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.post('/refresh',(req,res) => {
    const refreshToken= req.body.refreshToken
    //console.log(refreshToken)
    const spotifyApi = new spotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: 'bd2805db7c36486bb2fcd5f9263e2f7c',
        clientSecret: '6e5fc61df3264db8a2bb9ebf5236237c',
        refreshToken
    })
    spotifyApi.refreshAccessToken().then(
        (data) => {
            //console.log(data)
            res.json({
                accessToken: data.body.accessToken,
                expiresIn: data.body.expiresIn
            })
        }).catch((err) => {
            //console.log(err);
            res.sendStatus(400);
        });
})


app.post('/login',(req,res)=>{
    const code = req.body.code;
    const spotifyApi = new spotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: 'bd2805db7c36486bb2fcd5f9263e2f7c',
        clientSecret: '6e5fc61df3264db8a2bb9ebf5236237c'
    })

    spotifyApi.authorizationCodeGrant(code).then(data=>{
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    }).catch((err)=>{
        //console.log(err);
        res.sendStatus(400)})
})

app.get('/lyrics', async (req, res) => { 
    const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "No lyrics found"
    
    res.json({lyrics})
 })

app.listen(3001)