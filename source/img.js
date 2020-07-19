const download = require('image-downloader');


async function downloadIMG(urll, id) {
  const options = {
    url: urll,
    dest: 'source/img/poster/' + id + '.jpg'
  }
  try {
    if (!fs.existsSync(options.dest)) {
      const {
        filename,
        image
      } = await download.image(options)

      uzenetek("Képletöltés sikeres!");
      resizes(options.dest);
    }
  } catch (e) {
    uzenetek(e);
  }
}
