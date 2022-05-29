import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import Api from './ui-components/pages/Api';
const { uploadArchivedMedia } = Api;

export function saveScreenshot(element, storeLocally, accessToken, tweetUrl) {
    try {
        return domtoimage
            .toBlob(element.lastChild, { bgcolor: 'white' })
            .then(async function (blob) {
                let fileName;
                const url = location.href;

                try {
                    console.log('----- 1');
                    if (
                        url.startsWith('https://twitter.com') &&
                        url.search('/status/') != -1
                    ) {
                        console.log('----- 2');
                        fileName = url.slice(url.search('/status/') + 8);
                    } else {
                        console.log('----- 3');
                        fileName = new Date()
                            .toTimeString()
                            .split(' ')
                            .join('_');
                    }
                } catch (err) {
                    console.log('----- 4');
                    console.log(err);
                    fileName = new Date().toTimeString().split(' ').join('_');
                }
                if (storeLocally) {
                    saveAs(blob, `ogbv_plugin_tweet_${fileName}.png`);
                }

                var formData = new FormData();
                formData.append('screenshot', blob);
                formData.append('url', tweetUrl);
                // await uploadArchivedMedia(accessToken, formData);
                await uploadArchivedMedia(accessToken, formData);
            });
    } catch (err) {
        console.log('Could not save Image', err);
    }
}
