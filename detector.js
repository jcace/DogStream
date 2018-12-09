const vision = require("@google-cloud/vision");
const client = new vision.ImageAnnotatorClient();

/**
 * TEXT DETECTIOn - NOT WORKING?
 * @param {*} url 
 */
function hasText(url) {
  return new Promise((resolve,reject) => {
    client
    .textDetection("https://i.imgur.com/hZz9MqY.jpg")
    .then(results => {
      console.log(results[0])
      if (results[0].textAnnotations.length > 2) {
        console.log('ya')
        resolve(true);
      }
      resolve(false);
    })

    .catch(err => {
      reject(err);
    }); 
  })

}

module.exports = {
  hasText
}
