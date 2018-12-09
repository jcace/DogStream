const vision = require("@google-cloud/vision");
const imgur = require("imgur");
const Fs = require("fs");
const Path = require("path");
const Axios = require("axios");
const client = new vision.ImageAnnotatorClient();
const detector = require('./detector')
imgur.setAPIUrl("https://api.imgur.com/3/");

function dogBlaster() {
  var optionalParams = { sort: "time", dateRange: "week", page: 1 };
  imgur
    .search("dog", optionalParams)
    .then(async function(json) {
      json.data.forEach(entry => {
        imgur.getInfo(entry.cover).then(async result => {
          if (result.data.type === "image/jpeg") {
            let dog = await checkDog(result.data.link);
            // let isMeme = await detector.hasText(result.data.link);

            if (dog) {
              await downloadImage(
                result.data.link,
                result.data.link.split("/")[3]
              );
              console.log(result.data.link);
            }
          }
        });
      });
    })
    .catch(function(err) {
      console.error(err);
    });
}

const checkDog = url => {
  return new Promise((resolve, reject) => {
    client
      .labelDetection(url)
      .then(results => {
        const labels = results[0].labelAnnotations;
        labels.forEach(label => {
          if (label.score > 0.95 && label.description === "dog") {
            resolve(true);
          }
        });
        resolve(false);
      })
      .catch(err => {
        reject(err);
      });
  });
};

async function downloadImage(url, filename) {
  const path = Path.resolve(__dirname, "images", filename);

  // axios image download with response type "stream"
  const response = await Axios({
    method: "GET",
    url: url,
    responseType: "stream"
  });

  response.data.pipe(Fs.createWriteStream(path))

  // return a promise and resolve when download finishes
  return new Promise((resolve, reject) => {
    response.data.on("end", () => {
      resolve();
    });

    response.data.on("error", () => {
      reject();
    });
  });
}

dogBlaster();
