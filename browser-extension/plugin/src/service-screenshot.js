// import domtoimage from 'dom-to-image';
import domtoimage from 'dom-to-image-improved';
import { saveAs } from 'file-saver';
import Api from './ui-components/pages/Api';
const { uploadArchivedMedia } = Api;

export function saveScreenshot(element, storeLocally, accessToken, tweetUrl) {
    try {
        return domtoimage
            .toBlob(element.lastChild, {
                bgcolor: window
                    .getComputedStyle(document.body, null)
                    .getPropertyValue('background-color')
            })
            .then(async function (blob) {
                let fileName;
                const url = location.href;

                console.log({ blob, url, fileName });

                try {
                    if (
                        url.startsWith('https://twitter.com') &&
                        url.search('/status/') != -1
                    ) {
                        fileName = url.slice(url.search('/status/') + 8);
                    } else {
                        fileName = new Date()
                            .toTimeString()
                            .split(' ')
                            .join('_');
                    }
                } catch (err) {
                    console.log(err);
                    fileName = new Date().toTimeString().split(' ').join('_');
                }
                try {
                    if (storeLocally) {
                        try {
                            saveAs(blob, `ogbv_plugin_tweet_${fileName}.png`);
                        } catch (err) {
                            console.log('error saving locally');
                            console.log(err);
                        }
                    } else {
                        var formData = new FormData();
                        formData.append('screenshot', blob);
                        formData.append('url', tweetUrl);
                        console.log('-----1');
                        console.log({ formData });
                        await uploadArchivedMedia(accessToken, formData);
                    }
                } catch (err) {
                    throw err;
                }
            });
    } catch (err) {
        console.log('-----2');
        console.log('Could not save Image', err);
    }
}
