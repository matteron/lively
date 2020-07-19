# Lively

**This project is extremely work in progress.**

This is a live-reload, dev server made because the tool I used previously, Browser-Sync, doesn't seem to be maintained much and also does a lot more than I need.  I also wasn't able to find anything else that also supported cleanly running a function before reloading the page.

Browser-sync also has a very long install time with a ton of dependencies.

Like my other libraries, Lively also aims to as lightweight as possible.  There's on one dependency, [ws](https://www.npmjs.com/package/ws), which I'm already considering replacing as it's also doing way more than I need it for.

## Basic Usage

The following code will start a lively server 

```JavaScript
const { Lively } = require('./lib/index');

const lv = new Lively({
	root: 'src'
});

lv.watch('media/style.css');

lv.start();
```

## How