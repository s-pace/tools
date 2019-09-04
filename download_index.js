const algoliasearch = require('algoliasearch');
const fs = require('fs');
require('dotenv').config()
const AppID = process.env.APPLICATION_ID
const APIKey = process.env.API_KEY
const indexName = process.env.INDEX_NAME

if (!AppID || !APIKey || !indexName) {
    throw new Error('Wrong credentials')
}
const client = algoliasearch(AppID, APIKey);
const index = client.initIndex(indexName);

const browser = index.browseAll();
let hits = [];

browser.on('result', content => {
    hits = hits.concat(content.hits);
});

browser.on('end', () => {
    hits = hits.map(h => {
        delete h.objectID;
        delete h.anchor;
        h = {
            ...h,
            ...h.hierarchy
        };
        delete h.hierarchy;
        return h
    })
    hits = hits.sort((a, b) => a.lvl2 && b.lvl2 ? a.lvl2.localeCompare(b.lvl2) : 0);
    hits = hits.sort((a, b) => a.lvl1 && b.lvl1 ? a.lvl1.localeCompare(b.lvl1) : 0);
    hits = hits.sort((a, b) => a.lvl0 && b.lvl0 ? a.lvl0.localeCompare(b.lvl0) : 0);
    hits = hits.sort((a, b) => a.url.localeCompare(b.url))
    fs.writeFile(`${indexName}.json`, JSON.stringify(hits), 'utf8');
});

browser.on('error', err => {
    throw err;
});