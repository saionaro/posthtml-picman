# posthtml-picman [![npm version](https://badgen.net/npm/v/posthtml-picman)](https://www.npmjs.com/package/posthtml-picman) ![CI](https://github.com/Saionaro/posthtml-picman/workflows/CI/badge.svg) [![license](https://badgen.net/github/license/micromatch/micromatch)]()

HTML pictures simplified

Automatically unwrap pic tag into rich picture.

## Example

You write magical tag like this
```html
<pic
  src="./images/1.jpg"
  alt="The cute cat"
></pic>
```
We transform it into following
```html
<picture>
  <source
    type="image/webp"
    media="(max-width: 991px)"
    srcset="./images/1-tablet.webp 1x, ./images/1-tablet-2x.webp 2x"
  />

  <source
    media="(max-width: 991px)"
    srcset="./images/1-tablet.jpg 1x, ./images/1-tablet-2x.jpg 2x"
  />
  
  <source
    type="image/webp"
    srcset="./images/1.webp 1x, ./images/1-2x.webp 2x"
  />

  <img
    src="./images/1.jpg"
    srcset="./images/1-2x.jpg 2x"
    alt="The cute cat"
  />
</picture>
```

## Usage

`npm i posthtml-picman -D`

Then add picman to your posthtml config `.posthtmlrc`:
```
{
  plugins: {
    ...
    "posthtml-picman": {}
    ...
  }
}
```

## Options

### Plugin options
| Name        | Type        | Default value | Description                                                                                                           |
| ----------- | ----------- | ------------- | --------------------------------------------------------------------------------------------------------------------- |
| `breakpoints`    | `Record<string, number>`   | {}         | Hash table looks like `{ breakpointName: value }` Name will be used in file paths.     |
| `retinaSuffix`   | `string?`   | `"-2x"`      | Suffix for using with hight dpi images.                                                             |
| `mobileFirst`    | `boolean`   | `false`      | Use either `"max-width"` or `"min-width"` in breakpoints. `true` means `"min-width"`.               |


### Tag options
| Name        | Type        | Default value | Description                                                                                                           |
| ----------- | ----------- | ------------- | --------------------------------------------------------------------------------------------------------------------- |
| `src`         | `string`    | undefined    | Image path.                                             |
| `imgClass`    | `string?`   | `""`         | Class name to apply to `img` tag.                       |
| `picClass`    | `string?`   | `""`         | Class name to apply to `picture` tag.                   |
| `alt`         | `string?`   | `"Image"`    | Alt string. Strongly recommended to use.                |
