# Keyboard Layout Analyzer. Modern Remake

* Vue.js 3
* ES2015+ (features supported by the latest browsers)
* CSS3
* HTML5

Under development. See the working Angular.js version here https://github.com/NSUSpray/keyboard-layout-analyzer

## Dependencies

* [vue-three-shortkey](https://www.npmjs.com/package/vue-three-shortkey) — add keyboard shortcuts to many UI elements
* [kle-serial](https://github.com/ijprest/kle-serial) — de-serialize [Keyboard Layout Editor](http://www.keyboard-layout-editor.com/) keymaps
* [Turf.js](https://github.com/Turfjs/turf) ([bbox](https://github.com/Turfjs/turf/tree/master/packages/turf-bbox), [union](https://github.com/Turfjs/turf/tree/master/packages/turf-union)) — draw complex key paths

## TODO

- [ ] import/export/load key sets
- [ ] key editor window
- [ ] conversions between key maps

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
