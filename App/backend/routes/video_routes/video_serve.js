require('../../models/socialpost');

const fs = require('fs')
const mongoose = require('mongoose');
const router = require('express').Router();   

const SocialPost = mongoose.model('SocialPost');
// const passport = require('passport');
// const utils = require('../lib/utils');


router.get('/video', function(req, res) {


  var path = '' 

  SocialPost.findOne({ endpoint: req.query.endpoint })
  .then((socialpost_with_video) => {

    if(!socialpost_with_video){

      res.status(200).json({ success: false, msg: "no such video exists" });

    } else {

// video_for_post
      path = socialpost_with_video.video_for_post
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