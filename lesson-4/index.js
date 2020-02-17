const rp = require('request-promise');
const cheerio = require('cheerio');
const express = require('express');
const consolidate = require('consolidate');
const path = require('path');
const url = require('./url');

const getNews = (type) => rp({
    uri: `${url}${type}/`,
    transform: (dom) => cheerio.load(dom)
}).then(($) => {
    const result = {
        news: []
    };

    result.header = $('.rubric-list').find('.tag-input__tag-text').text();
    $('.list-item').each((i, element) => {
        const anchor = $(element).find('.list-item__title');
        result.news.push({
            title: anchor.text(),
            link: anchor.attr('href')
        });        
    });
    console.log('processing', result);
    return result;
}).catch((error) => {
    console.error(error);
    return { header: 'Something went wrong', news: []};
});


const app = express();

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('main');
});

app.get('/news', (req, res) => {
    const type = req.query.type;
    getNews(type).then((result) => {
        console.log('result', result);
        res.render('news', result);
    });
});

app.listen(4000, () => {
    console.log('Server is listening port ', 4000);
});