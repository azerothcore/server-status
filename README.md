# AzerothCore Server Status

This is a simple web application built with Angular2+ and Bootstrap to show the online players list of a AzerothCore server.

It is based on the [AzerothAPI](https://github.com/AzerothJS/AzerothAPI).

![Server Status](https://raw.githubusercontent.com/azerothcore/server-status/master/icon.png)

### Installation

The application require the [AzerothAPI](https://github.com/AzerothJS/AzerothAPI) to access to the characters database.

Clone the Server-Status folder inside your web server directory:
```
git clone https://github.com/azerothcore/server-status.git
```
Then copy the file `config.ts.dist` to `config.ts`, open it and set properly with the path of the API and the server name.

### 🎨 Theme Management (New Feature)

This project now supports **multiple visual themes**.
![Azeroth Theme](https://github.com/benoitheylens/server-status/blob/master/assets/Server-status_Azeroth_Theme.png)

#### How to select a theme:
1. Open the file: `src/styles.scss`
2. Uncomment the `@use` line corresponding to the theme you want to activate.
3. Ensure all other themes are commented out.

##### Example:
```scss
// @use 'theme-legacy';
@use 'theme-azeroth';
```

✅ Note: Only one theme should be active at a time.
This manual selection keeps things simple and avoids unnecessary complexity.

You can fully customize styles by editing the corresponding theme files in src/styles/.

### Contribute
You can help us [opening a new issue](https://github.com/azerothcore/server-status/issues/new) to report a bug or a suggestion or you can donate to support us [![Donate PayPal](https://camo.githubusercontent.com/ed44813b2a0ca01f80a00cca116f04208c127a80/68747470733a2f2f7777772e70617970616c2e636f6d2f656e5f47422f692f62746e2f62746e5f646f6e61746543435f4c472e676966)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=WE5LZM2D4WPBC&source=url)

---
### Contributors
Original project by [ShinDarth](https://github.com/FrancescoBorzi) & [Helias](https://github.com/Helias)
Theme system, design refactor and enhancements by [Ben](https://github.com/benoitheylens)
