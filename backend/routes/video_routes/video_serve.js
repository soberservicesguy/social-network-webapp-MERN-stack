require('../../models/socialpost');

const fs = require('fs')
const mongoose = require('mongoose');
const router = require('express').Router();   

const SocialPost = mongoose.model('SocialPost');
// const passport = require('passport');
// const utils = require('../lib/utils');

console.log('INCORPORATED VIDEOS')

router.get('/video', function(req, res) {

  console.log('incoming')
  console.log( req.query.endpoint )

  var path = '' 

  SocialPost.findOne({ endpoint: req.query.endpoint })
  .then((socialpost_with_video) => {

    if(!socialpost_with_video){

      console.log('NO VIDEO FOUND')
      res.status(200).json({ success: false, msg: "no such video exists" });

    } else {

      console.log('FILE PATH')
      console.log(socialpost_with_video)
// video_for_post
      path = socialpost_with_video.video_for_post
      // const path = '/home/arsalan/Work_stuff/Full_stack_apps/REACT_APPS/Final_portfolio/content_app/backend/assets/videos/sample.mp4'
      const stat = fs.statSync(path)
      const fileSize = stat.size
      const range = req.headers.range

      if (range) {

        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1]
          ? parseInt(parts[1], 10)
          : fileSize-1

        if(start >= fileSize) {

          res.status(416).send('Requested range not satisfiable\n'+start+' >= '+fileSize);
          return

        }
        
        const chunksize = (end-start)+1
        const file = fs.createReadStream(path, {start, end})
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
        }

        res.writeHead(206, head)
        file.pipe(res)

      } else {

        const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
        }

        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)

      }


    }

  })

})

module.exports = router;