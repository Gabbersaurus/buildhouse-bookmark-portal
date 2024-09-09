const https = require('https');
const fs = require('fs');
const path = require('path');

const settingsFilePath = path.join(__dirname, 'bbp_settings.json');
let bookmarksData = JSON.parse(fs.readFileSync(settingsFilePath, 'utf8'));

// Gets the favicon, resizes it to 128x128, and converts to Base64
function fetchFavicon(baseurl, callback) {
    const url = `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${baseurl}&size=128`;
    https.get(url, (res) => {
        if (res.statusCode === 200) {
            let data = [];
            res.on('data', chunk => data.push(chunk));
            res.on('end', () => {
                const buffer = Buffer.concat(data);
                const base64 = `data:image/png;base64,${buffer.toString('base64')}`;
                callback(null, base64);
            });
        } else {
            callback(new Error(`Failed to fetch favicon: ${res.statusCode}`));
        }
    }).on('error', (err) => {
        callback(err);
    });
}

// Updates existing JSON with fetched Base64 favicons
async function updateBookmarksWithFavicons() {
    const promises = bookmarksData.bookmarks.map((bookmark) => {
        return new Promise((resolve) => {
            const url = new URL(bookmark.url);
            const baseurl = url.protocol + "//" + url.hostname;
            fetchFavicon(baseurl, (err, faviconBase64) => {
                if (!err) {
                    bookmark.favicon = faviconBase64;
                } else {
                    console.error(`Error fetching favicon for ${baseurl}:`, err);
                }
                resolve();
            });
        });
    });

    await Promise.all(promises);

    fs.writeFileSync(settingsFilePath, JSON.stringify(bookmarksData, null, 2), 'utf8');
    console.log('Bookmarks updated with favicons.');
}

updateBookmarksWithFavicons().catch(error => console.error('Error updating bookmarks:', error));