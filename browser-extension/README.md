<p align="center">
	<a href="http://uli.tatle.co.in"><img src="docs/assets/uli-logo.png" alt="Uli Logo" width="116"></a>
	<br>
	<h2 align="center">Moderate your Twitter Feed</h2>
</p>

## Features

- Automatic Slur Replacement for Languages spoken in India (Currently supported Tamil, Hindi and English)
- Archive Tweets
- Invoke Networks

<p align="left">
	<img src="docs/assets/hero-illustrations.gif" width="350"/>
</p>

## Code Organization

| Directory  | Description                                                    |
| ---------- | -------------------------------------------------------------- |
| plugin     | code for browser extension                                     |
| api-server | a rest server for storing user preferences and archived tweets |

# Build from Source

Requirements :

- npm : v8.7.0^
- nodejs : 16.4.2^

When you run `docker-compose up`, ensure to have a `development.env` file with the following variables in the `api-server` directory.

```
NODE_ENV=development
AWS_BUCKET_NAME=XXXXXXXXXXX
SERVICE_AWS_ACCESS_KEY_ID=XXXXXXXXXX
SERVICE_AWS_SECRET_ACCESS_KEY=XXXXXXX
DB_HOST: XXXXXXXXXXX
DB_USERNAME: XXXXXXXXXXX
DB_PASSWORD: XXXXXXXXXXX
```



## For Development

```
git clone https://github.com/tattle-made/OGBV.git
cd browser-extension/
cd plugin && npm install
docker-compose up
```

Setup the database by running `docker exec -it api-server npx sequelize-cli db:migrate`. You should be able to see uli related tables in the sql database now.

To run the the api server run `docker exec -it api-server npx sequelize-cli nodemon index.js`.

To run the plugin development server, run `cd plugin` and then the following :

1. For Chrome : `npm run dev:chrome`
2. For Firefox : `npm run dev:firefox`

If all services run correctly, you should be able to load the plugin from `plugin/dist` folder into Chrome/Brave/Firefox.

#### For Windows only

If you are developing on Windows and run into errors where certain files are not being copied, go to `plugin/package-json` and in the commands `npm run dev:chrome` and `npm run dev:firefox`, replace the command `cp` with `copy` and the front slashes in all the file paths to double back slashes. Secondly, running the commands mentioned in the table above will create a `-p` and a `dist` folder everytime which you will need to delete in order to generate a new distribution to reflect major changes.

## Installing unreleased extension

To learn how to install unreleased extension in your browser follow the instructions [here](https://webkul.com/blog/how-to-install-the-unpacked-extension-in-chrome/)

Look into individual README within the `api-server` and `plugin` folder for more info.

## Cleaning changes

In order to remove the dist folder to start with a new distribution, run the following command:

```
cd plugin && npm run dev:clean
```

## For Production

For Chrome/Brave:

```
cd plugin && npm run build
```

For Firefox:

```
cd plugin && npm run build:firefox
```

This will bundle all files related to the plugin into `/dist`, this can now be loaded on a browser or uploaded to the chrome store.

# Contributing

Head over to the [contribution guide](CONTRIBUTING.md)
