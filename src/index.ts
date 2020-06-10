import { PostHTML } from "posthtml";

import { Breakpoint, InnerOptions, PluginOptions } from "./types";

const defBreakpoints = {
  tablet: 1024,
};

const defineProp = (
  obj: Record<string, string>,
  key: string,
  value: string
): void => {
  Object.defineProperty(obj, key, {
    value: value,
    enumerable: true,
  });
};

const constructSource = (
  baseSrc: string,
  x2suffix: string,
  ext: string,
  breakpoint: Breakpoint
): PostHTML.RawNode => {
  const { sourceType } = breakpoint;

  let media;
  let breakSuffix = "";

  if ("name" in breakpoint) {
    media = `(${breakpoint.kind}: ${breakpoint.value}px)`;
    breakSuffix = `-${breakpoint.name}`;
  }

  const attrs = {
    srcset: `${baseSrc}${breakSuffix}.${ext} 1x,
             ${baseSrc}${breakSuffix}${x2suffix}.${ext} 2x`,
  };

  if (sourceType) defineProp(attrs, "type", sourceType);
  if (media) defineProp(attrs, "media", media);

  return { tag: "source", attrs };
};

const constructPicture = ({
  tagOpts,
  options,
}: {
  tagOpts: PostHTML.NodeAttributes | void;
  options: InnerOptions;
}): PostHTML.RawNode => {
  let alt = "";
  let src = "";
  let imgClass = "";
  let picClass = "";

  if (tagOpts) {
    if ("alt" in tagOpts && tagOpts.alt) {
      alt = tagOpts.alt ?? "";
    }

    if ("src" in tagOpts && tagOpts.src) {
      src = tagOpts.src ?? "";
    }

    if ("imgClass" in tagOpts && tagOpts.imgClass) {
      imgClass = tagOpts.imgClass ?? "";
    }

    if ("picClass" in tagOpts && tagOpts.picClass) {
      picClass = tagOpts.picClass ?? "";
    }
  }

  if (!alt) {
    console.warn(src);
    console.warn('"alt" doesn\'t set!');
  }

  const x2suffix = options.retinaSuffix;
  const originalParts = src.split(".");
  const ext = originalParts.pop() || "";
  const baseSrc = originalParts.join(".");
  const originalSrcset = `${baseSrc}${x2suffix}.${ext} 2x`;

  const contents: PostHTML.RawNode[] = [];

  for (const key of Object.keys(options.breakpoints)) {
    const kind = options.mobileFirst ? "min-width" : "max-width";
    const value = options.breakpoints[key];

    contents.push(
      constructSource(baseSrc, x2suffix, ext, {
        kind,
        value,
        name: key,
      })
    );

    contents.push(
      constructSource(baseSrc, x2suffix, "webp", {
        kind,
        value,
        name: key,
        sourceType: "image/webp",
      })
    );
  }

  contents.push(
    constructSource(baseSrc, x2suffix, "webp", { sourceType: "image/webp" })
  );

  {
    const attrs = {
      src,
      srcset: originalSrcset,
      alt,
    };

    if (imgClass) defineProp(attrs, "class", imgClass);

    contents.push({
      tag: "img",
      attrs,
    });
  }

  const attrs = {};

  if (picClass) defineProp(attrs, "class", picClass);

  return {
    attrs,
    tag: "picture",
    content: contents,
  };
};

export default (options: PluginOptions): PostHTML.Plugin<void> => {
  const breakpoints = options.breakpoints || defBreakpoints;
  const retinaSuffix = options.retinaSuffix || "-2x";
  const cdnPrefix = options.cdnPrefix || "";
  const mobileFirst = Boolean(options.mobileFirst) || true;

  return function posthtmlPicer(tree: PostHTML.Node) {
    tree.match({ tag: "pic" }, (node) => {
      return constructPicture({
        tagOpts: node.attrs,
        options: {
          breakpoints,
          retinaSuffix,
          cdnPrefix,
          mobileFirst,
        },
      });
    });

    return tree;
  };
};
