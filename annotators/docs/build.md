UI Build Instructions

open `annotators/annotation-ui/src/components/config.js` to ensure that the `api_endpoint` is set to the right target.

ensure that `<ReactJson/>` is not used anywhere in the code. We use it for debugging the app but for some reason gatsby can't build apps with this component. I never really needed to use it in production so we never got to fix it.

run `npm run build` to build the gatsby site and move the `public` directory into the backend folder

commit the files and push to github