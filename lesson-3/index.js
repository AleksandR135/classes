const request = require('request');
const cheerio = require('cheerio');
const url = require('./url');

request(url, (err, res, dom) => {
    if (!err && res.statusCode === 200) {
        const $ = cheerio.load(dom);
        const result = []
        $('.list-item').each((i, element) => {
            const anchor = $(element).find('.list-item__title');
            result.push({
                title: anchor.text(),
                link: anchor.attr('href')
            });
        });

        console.log('\n');
        console.log('Новости экономики');
        result.forEach((article, i) => {
            console.log('--------------------------------------------------------------------');
            console.log(`#${i + 1} - ${article.title}`);
            console.log(`Читать по ссылке - ${article.link}`);
        })
        console.log('\n');
    }
})