import { dom } from './twitter';
import { current } from './twitter/pages';
const { setOnChangeListener } = dom;
import transform_v2 from './transform-v2';
import { log } from './logger';
import repository from './repository';
const { getPreferenceData, setPreferenceData } = repository;
import { updateSlurList } from './slur-replace';
import transformGeneral from './transform-general';

log('Content Script Loaded');

function processPage(newUrl) {

    const twitterUrl = 'twitter.com'
    if (newUrl.includes(twitterUrl)) {

        var mainLoadedChecker = setInterval(() => {
            
            if (newUrl.includes(twitterUrl)) {
                console.log('tick');
                const targetNode = document.getElementsByTagName('main')[0];
                console.log({ targetNode });
                if (targetNode) {
                    let currentPage = current(newUrl);
                    const { page } = currentPage;
                    const { getTimeline } = page;
    
                    if (getTimeline === undefined) {
                        log('Unknown State. Could not find Timeline');
                    } else {
                        let timeline = getTimeline();
                        // log({ timeline });
                        transform_v2.processNewlyAddedNodes_v2(timeline.children); //changed to v2 here
                        setOnChangeListener(timeline, transform_v2.processNewlyAddedNodes_v2);
                    }
                    
                    clearInterval(mainLoadedChecker);
                } else {
                    console.log('main section loaded');
                }
            }
            
        }, 500);

    }
    else {


        function mySetInterval(f,t) {
            var x =
              setInterval(
                function() {
                  f();
                  clearInterval(x);
                },
                t 
              )
          }
          
        mySetInterval(function() {

            console.log('tick');
            const elems = document.querySelectorAll('p, span, li');
            
            console.log({ elems });
            
            if (elems) {
                  

                
                
                transformGeneral.processNewlyAddedNodesGeneral(elems); 
                setOnChangeListener(elems, transformGeneral.processNewlyAddedNodesGeneral);
                
                clearInterval(mainLoadedChecker);
                console.log(mainLoadedChecker);

            }
            else {
                console.log('main section loaded');
            }
           
    }, 500)
    

    }
    

    
}

/**
 * This Listens to any changed on the URL
 * eg : When a user clicks on a tweet on their home timeline, they
 * go from the home page to the user status page.
 */

chrome.runtime.onMessage.addListener(async function (request) {
    if (request.type === 'updateData') {
        console.log('data changed. time to update slurs');
        const preference = await getPreferenceData();
        console.log(preference);
        if (preference.slurList != undefined) {
            updateSlurList(preference.slurList);
            processPage(location.href);
        }
        return true;
    }
    if (request.message === 'URL_CHANGED') {
        const newUrl = request.url;
        log('Url Changed', newUrl);
        processPage(location.href);
        return true;
    }
    if (request.type === 'SLUR_ADDED') {
        const slur = request.slur;
        log('slur added from bg', slur);
        const pref = await getPreferenceData();
        if (!pref) {
            slurList = slur;
            await setPreferenceData({ ...pref, slurList });
        } else {
            let { slurList } = pref;
            if (!slurList || slurList === '') {
                slurList += slur;
            } else {
                slurList += `,${slur}`;
            }
            await setPreferenceData({ ...pref, slurList });
        }

        return true; 
    }
});

window.addEventListener(
    'load',
    () => {
        console.log('content loaded');
        processPage(location.href);
    },
    false
);
