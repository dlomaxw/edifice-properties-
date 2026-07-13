const http = require('https');

const videoIds = [
  'k3A4DfR2z1o',
  'n3lhXEN9_Hs',
  'M4xHnToEWbI',
  'gz3IQbBVr9Q',
  '2DYu1--DbgM',
  'cintZUdWXYY',
  'xJhXa_Nsl_I',
  'yHbu_nVRwrs',
  '5SdItw9WkAE'
];

function fetchMetadata(id) {
  return new Promise((resolve) => {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ id, title: json.title, author: json.author_name });
        } catch (e) {
          resolve({ id, error: true });
        }
      });
    }).on('error', () => {
      resolve({ id, error: true });
    });
  });
}

async function main() {
  console.log('Fetching YouTube oEmbed Metadata...');
  const results = await Promise.all(videoIds.map(fetchMetadata));
  console.log('\nResults:');
  console.log(JSON.stringify(results, null, 2));
}

main();
