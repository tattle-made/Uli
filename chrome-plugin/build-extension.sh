rm -rf dist
npx parcel build html/*.html react/*.jsx
cp manifest.json dist/
cp background.js dist/
cp content-script.js dist/
cp slur-replace.js dist/