# Basic Starter Kit

[![Starter Kit](https://img.shields.io/badge/starter--kit-v1.2-brightgreen.svg)]()

## About
In this repository you will find a simple starter kit to quickly bootstrap new projects.  
There are some basic gulp tasks that will help you with the following tasks:

-   Compile handlebars templates into static HTML
-   Compile Sass in CSS
-   Lint, Transpile & Bundle Javascript
-   Optimize images
-   Create an icon-font from svg's
-   Fire up a server with watch mode

## Usage
To use the starter kit, copy the content into your new project folder, and run the following commands:

```shell
npm install
npm run clean
```

The command `npm install`  will install all dependencies.  
After installation the command `npm run clean` will make sure there are no more old `.git` files in the directory and it will start the `npm init` command.

After this you can either:  
- Run `gulp watch` which builds all the files into the `dist` folder and fires up a local server into watch mode.  
- Run `gulp build` to just build all the files. Use `--production` to minify all the `css` and `javascript`. 

You're all set to develop now!