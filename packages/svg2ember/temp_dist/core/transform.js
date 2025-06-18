"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SVGO_CONFIG = void 0;
exports.transform = transform;
var svg_parser_1 = require("svg-parser");
var svgo_1 = require("svgo");
exports.DEFAULT_SVGO_CONFIG = {
    multipass: true,
    plugins: [
        {
            name: 'preset-default',
            params: {
                overrides: {
                    removeViewBox: false,
                },
            },
        },
        'removeXMLNS',
    ],
};
function transform(svgContent, options) {
    if (options === void 0) { options = {}; }
    var _a = options.typescript, typescript = _a === void 0 ? false : _a, _b = options.optimize, shouldOptimize = _b === void 0 ? true : _b, _c = options.svgoConfig, svgoConfig = _c === void 0 ? exports.DEFAULT_SVGO_CONFIG : _c;
    var processedSvg = svgContent;
    // Optimize SVG if requested
    if (shouldOptimize) {
        var result = (0, svgo_1.optimize)(svgContent, svgoConfig);
        processedSvg = result.data;
    }
    // Parse SVG using svg-parser for AST-based processing
    var ast;
    try {
        ast = (0, svg_parser_1.parse)(processedSvg);
    }
    catch (_d) {
        throw new Error('Invalid SVG: Failed to parse SVG content');
    }
    if (!ast.children || ast.children.length === 0) {
        throw new Error('Invalid SVG: No content found');
    }
    // Find the root SVG element
    var svgElement = ast.children.find(function (child) { return child.type === 'element' && child.tagName === 'svg'; });
    if (!svgElement) {
        throw new Error('Invalid SVG: No <svg> root element found');
    }
    // Generate Ember component template
    var componentCode = generateEmberComponent(svgElement, typescript);
    var extension = typescript ? '.gts' : '.gjs';
    return {
        code: componentCode,
        extension: extension,
    };
}
function generateEmberComponent(svgElement, typescript) {
    // Convert AST back to SVG string with attributes spread
    var svgString = astToSvgString(svgElement);
    if (typescript) {
        return "import type { TOC } from '@ember/component/template-only';\n\ninterface Signature {\n  Element: SVGSVGElement;\n}\n\nconst IconComponent: TOC<Signature> = <template>\n  ".concat(svgString, "\n</template>;\n\nexport default IconComponent;");
    }
    else {
        return "<template>\n  ".concat(svgString, "\n</template>");
    }
}
function astToSvgString(element) {
    if (element.type !== 'element') {
        return element.type === 'text' ? element.value || '' : '';
    }
    var tagName = element.tagName, _a = element.properties, properties = _a === void 0 ? {} : _a, _b = element.children, children = _b === void 0 ? [] : _b;
    // Convert properties to attribute string
    var attrs = Object.entries(properties)
        .map(function (_a) {
        var key = _a[0], value = _a[1];
        return "".concat(key, "=\"").concat(value, "\"");
    })
        .join(' ');
    var attrsString = attrs ? " ".concat(attrs) : '';
    // Never self-close <svg> because we add {{yield}}
    if (children.length === 0 && tagName !== 'svg') {
        return "<".concat(tagName).concat(attrsString, " />");
    }
    var childrenString = children
        .map(function (child) { return astToSvgString(child); })
        .join('');
    if (tagName === 'svg') {
        // Add `...attributes` to the opening `<svg>` tag
        attrsString = "".concat(attrsString, " ...attributes");
        // Add `{{yield}}` just before the closing `</svg>`
        childrenString = "".concat(childrenString, "{{yield}}");
    }
    return "<".concat(tagName).concat(attrsString, ">").concat(childrenString, "</").concat(tagName, ">");
}
