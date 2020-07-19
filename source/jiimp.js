/* RESIZE OPTIMIZE IMAGES */
const Jimp = require('jimp');

 //let proba = './source/img/poster/73255.jpg' ;
 function resizes(proba) {
   Jimp.read(proba)
     .then(lenna => {
       return lenna
         .resize(90,130) // resize
         .write(proba); // save
     })
     .catch(err => {
       console.error(err);
     });

 }
