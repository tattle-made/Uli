/**
 * function specific to the idiosyncracies of various twitter
 * pages go here
 */
import home from './home';
import userStatus from './user-status';
import userProfile from './user-profile';
import search from './search';
import fallBack from './fallback';

const pageType = {
    TIMELINE: 'TIMELINE',
    USER_PROFILE: 'USER_PROFILE',
    USER_STATUS: 'USER_STATUS',
    HOME: 'HOME',
    SEARCH: 'SEARCH',
    UNSUPPORTED: 'UNSUPPORTED'
};

function getPageType(url) {
    const userProfilePathRegex = new RegExp(
        /^https?:\/\/twitter.com\/(\w+)$/,
        'i'
    );
    const userStatusPathRegex = new RegExp(
        /^https?:\/\/twitter.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)$/,
        'i'
    );
    const homePathRegex = new RegExp(/^https:\/\/twitter.com\/home$/, 'i');

    let type;

    if (homePathRegex.test(url)) {
        type = pageType.HOME;
    } else if (userProfilePathRegex.test(url)) {
        type = pageType.USER_PROFILE;
    } else if (userStatusPathRegex.test(url)) {
        type = pageType.USER_STATUS;
    } else if (url.startsWith('https://twitter.com/search')) {
        type = pageType.SEARCH;
    } else {
        type = pageType.UNSUPPORTED;
    }

    return type;
}

const pages = {
    HOME: home,
    USER_STATUS: userStatus,
    USER_PROFILE: userProfile,
    SEARCH: search,
    UNSUPPORTED: fallBack
};

const current = (url) => {
    let type, page;

    type = getPageType(url);
    console.log({ TYPE: type, PAGES: pages });
    page = pages[type];

    return {
        type,
        page
    };
};

export { pages, pageType, getPageType, current };
