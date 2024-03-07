const getProduct = require('./models/getProduct');

const fs = require('node:fs');
const axios = require('axios');
const cheerio = require('cheerio');
let currentPage = 1
const url = `https://lsys.by/katalog/oborudovanie_dlya_ustanovki_na_din_reyku/vyklyuchateli_modulnye/?by=NAME&order=DESC&PAGEN_1=${currentPage}`;
let links = [];
let data = [];
let amountOfPages;

async function getAmountOfPages() {
  axios.get(url + currentPage)
    .then(response => {
      const html = response.data
      const $ = cheerio.load(html);
      amountOfPages = $('.bx-pagination-container>ul').children().length - 2;
      console.log('amountOfPages: ', amountOfPages);

      return amountOfPages;
    })
    .then(response => {
      runScraping(url)
        .then(response => {
          links = response[0];
          return links;
        })
      .then(async links => {
        for (let i = 0; i < links.length; i++) {
          await getProductItem(links[i]);
        }
        console.log('data: ', data);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

getAmountOfPages()

async function runScraping(url) {
  let promises = [];

  for (let currentPage = 1; currentPage <= amountOfPages; currentPage++) {

    promise = axios.get(url + currentPage)
      .then(response => {
        const html = response.data
        const $ = cheerio.load(html);
        const items = $('.prods-list__info');

        items.each((index, element) => {
          let link = $(element).find('a').attr('href');
          links.push(`https://lsys.by${link}`);
        })

        return links;
      })
      .catch((error) => {
        console.log(error);
      });
    promises.push(promise);
  }
  return Promise.all(promises);
}




// 1 version
// axios.get(url + currentPage)
//   .then(response => {
//     const html = response.data
//     const $ = cheerio.load(html);
//     const items = $('.prods-list__info');

//     items.each((index, element) => {
//       let link = $(element).find('a').attr('href');
//       links.push(`https://lsys.by${link}`);
//     })
//     currentPage++
//     console.log('currentPage: ', currentPage);
//     return links;
//   })
//   .then(links => {
//     if (currentPage <= amountOfPages) {
//       axios.get(url + currentPage)
//         .then(response => {
//           const html = response.data
//           const $ = cheerio.load(html);
//           const items = $('.prods-list__info');

//           items.each((index, element) => {
//             let link = $(element).find('a').attr('href');
//             links.push(`https://lsys.by${link}`);
//           })
//           currentPage++
//           console.log('currentPage: ', currentPage);
//           return links;
//         })
//       return links
//     }
//     return links
//   })
//   .then(async (links) => {
//     for (let i = 0; i < links.length; i++) {
//       await getProductItem(links[i]);
//     }
//     console.log('data: ', data.length);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

//2 version
// axios.get(url + currentPage)
//   .then(response => {
//     const html = response.data
//     const $ = cheerio.load(html);
//     const items = $('.prods-list__info');

//     items.each((index, element) => {
//       let link = $(element).find('a').attr('href');
//       links.push(`https://lsys.by${link}`);
//     })
//     console.log('amountOfPages: ', amountOfPages + 1);
//     return links;
//   })
// .then(async (links) => {
//   for (let i = 0; i < links.length; i++) {
//     await getProductItem(links[i]);
//   }
//   console.log('data: ', data.length);


// })
//   .catch((error) => {
//     console.log(error);
//   });



async function getProductItem(link) {
  await axios.get(link)
    .then(response => {
      let productItem = {};
      const html = response.data;
      const $ = cheerio.load(html);
      const articleElements = $('.prod__info');
      articleElements.each((index, el) => {
        const articleId = $(el).find('.prod__vendor-code').text().split(' ')[1].trim();
        productItem.articleId = articleId;

      })
      const elements = $('.tab_show');
      elements.each((index, element) => {
        const name = $(element).find('p').text().split('\n');

        for (const iterator of name) {
          getProduct(iterator, productItem);
        }
        productItem.productLink = link;
      })
      data.push(productItem);

      fs.writeFile('./data.json', JSON.stringify(data), err => {
        if (err) {
          console.error(err);
        } else {
          console.log("file written successfully");
        }
      });
    })
}
