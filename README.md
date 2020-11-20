# CS 147 Synqify IOT Project
Synqify is a IOT application created by Harrison Huang, Kayla Tran, and Karen Vu for the Fall 2020 course offering of 
CS 147 at UC Irvine. This application allows user to connect speakers via Raspberry Pis to play music through Spotify
synchronously. 

## Prerequisites
Node v12.16.0 or higher
```
https://nodejs.org/en/download/
```
Yarn 1.22.- or higher
```
https://classic.yarnpkg.com/en/docs/install
```

Running on: Python 3.8
```
https://www.python.org/downloads/release/python-380/
```

## Dependencies

Use the package manager [yarn](https://yarnpkg.com/) to install:

```bash
yarn install
```

Installs `node_modules` and `pipenv` dependencies for development.<br />

## Available Scripts

In the project directory, you can run:

### `yarn start`

This will start the front-end and load it on your preferred browser
link: [http://localhost:3000](http://localhost:3000)

Recommended browser: Google Chrome

### `yarn start-api`

This will start the back-end
(you should get something like this):
```yarn run v1.22.4
$ cd src/api && pipenv run flask run
 * Serving Flask app "app.py" (lazy loading)
 * Environment: development
 * Debug mode: on
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 211-628-180
```