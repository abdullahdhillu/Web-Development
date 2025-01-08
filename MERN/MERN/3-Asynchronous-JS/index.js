const fs = require("fs");
const superagent = require("superagent");
// fs.readFile(`./dog.txt`, (err, data) => {
//   const breed = data.toString().trim();
//   console.log(breed);
//   superagent
//     .get(`https://dog.ceo/api/breed/${breed}/images/random`)
//     .end((err, res) => {
//       if (err) {
//         console.log(err);
//       }
//       console.log(res.body.message);
//     });
// });

//--------------------------
//Using then methods
// fs.readFile(`./dog.txt`, (err, data) => {
// const breed = data.toString().trim();
// console.log(breed);
// superagent
//   .get(`https://dog.ceo/api/breed/${breed}/images/random`)
//   .then((res) => {
//     console.log(res.body.message);
//     fs.writeFile("dog-img.txt", res.body.message, (err) => {
//       if (err) return console.log(err.message);
//     });
//   })
//   .catch((err) => {
//     if (err) {
//       console.log(err.message);
//     }
//   });
// });

//--------------------------
//Manually creating promises
const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        reject("File Not Found");
      }
      resolve(data.toString().trim());
    });
  });
};

const writeFilePro = (file, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, content, (err, data) => {
      if (err) {
        reject("File Not Found");
      }
      resolve("Success");
    });
  });
};

// readFilePro(`${__dirname}/dog.txt`).then((data) => {
//   const breed = data;
//   console.log(breed);
//   superagent
//     .get(`https://dog.ceo/api/breed/${breed}/images/random`)
//     .then((res) => {
//       console.log(res.body.message);
//       fs.writeFile("dog-img.txt", res.body.message, (err) => {
//         if (err) return console.log(err.message);
//       });
//     })
//     .catch((err) => {
//       if (err) {
//         console.log(err.message);
//       }
//     });
// });

//To escape the callback hell
// readFilePro(`${__dirname}/dog.txt`)
//   .then((data) => {
//     const breed = data;
//     console.log(breed);
//     return superagent.get(`https://dog.ceo/api/breed/${breed}/images/random`);
//   })
//   .then((res) => {
//     console.log(res.body.message);
//     return writeFilePro("dog-img.txt", res.body.message);
//   })
//   .then(() => {
//     console.log("Success");
//   })
//   .catch((err) => {
//     if (err) {
//       console.log(err.message);
//     }
//   });

//--------------------
//Taking it to the next level using async/await
const getDogImage = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    const breed = data;
    console.log(breed);
    const resPro1 = await superagent.get(
      `https://dog.ceo/api/breed/${breed}/images/random`
    );
    const resPro2 = await superagent.get(
      `https://dog.ceo/api/breed/${breed}/images/random`
    );
    const resPro3 = await superagent.get(
      `https://dog.ceo/api/breed/${breed}/images/random`
    );
    const all = await Promise.all([resPro1, resPro2, resPro3]);
    const imgs = all.map((el) => el.body.message);
    // console.log(res.body.message);
    await writeFilePro("dog-img.txt", imgs.join("\n"));
    console.log("Success");
  } catch (err) {
    console.log(err.message);
  }
};
getDogImage();
