webpackJsonp([0],{

/***/ 162:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.RGBtoHEX = function (_a) {
    var red = _a.red, green = _a.green, blue = _a.blue;
    var rHex = ("00" + red.toString(16)).slice(-2);
    var gHex = ("00" + green.toString(16)).slice(-2);
    var bHex = ("00" + blue.toString(16)).slice(-2);
    return rHex + gHex + bHex;
};
var hxcmToRgb = function (H, X, C, M) {
    var hRange = Math.ceil(H / 10) % 6;
    console.log("Hue: " + H + ", range: " + hRange);
    var toRgb = function (r, g, b) {
        var red = Math.round((r + M) * 255);
        var green = Math.round((g + M) * 255);
        var blue = Math.round((b + M) * 255);
        return { red: red, green: green, blue: blue };
    };
    if (H < 60)
        return toRgb(C, X, 0);
    else if (H < 120)
        return toRgb(X, C, 0);
    else if (H < 180)
        return toRgb(0, C, X);
    else if (H < 240)
        return toRgb(0, X, C);
    else if (H < 300)
        return toRgb(X, 0, C);
    else
        return toRgb(C, 0, X);
};
exports.HSLtoRGB = function (_a) {
    var H = _a.hue, saturation = _a.saturation, lightness = _a.lightness;
    var S = saturation / 100;
    var L = lightness / 100;
    var C = (1 - Math.abs(2 * L - 1)) * S;
    var X = C * (1 - Math.abs((H / 60) % 2 - 1));
    var m = L - C / 2;
    return hxcmToRgb(H, X, C, m);
};
exports.HSVtoRGB = function (_a) {
    var H = _a.hue, saturation = _a.saturation, value = _a.value;
    var S = saturation / 100;
    var V = value / 100;
    var C = V * S;
    var X = C * (1 - Math.abs((H / 60) % 2 - 1));
    var m = V - C;
    return hxcmToRgb(H, X, C, m);
};


/***/ }),

/***/ 163:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Selectors = {
    headerText: '#color-scroll-icon-text',
    icon1: '#color-scroll-icon-1',
    icon2: '#color-scroll-icon-2',
    hueValue: '.hue-value',
    saturationValue: '.saturation-value',
    lightnessValue: '.lightness-value',
    hslString: '.hsl-string',
    hexString: '.hex-string',
    colorDetailsWidget: '#color-details-widget'
};


/***/ }),

/***/ 164:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(471));
__export(__webpack_require__(472));
__export(__webpack_require__(167));
__export(__webpack_require__(166));
__export(__webpack_require__(165));


/***/ }),

/***/ 165:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = __webpack_require__(14);
var shared_1 = __webpack_require__(58);
var hsl_values_1 = __webpack_require__(166);
/*
 This file exports 1 reactive variables:
 - hslString$: Observable<string>
 ---
 Notes:
 - Operators: .combineLatest
*/
exports.hslString$ = rxjs_1.Observable.combineLatest(hsl_values_1.hue$, hsl_values_1.sat$, hsl_values_1.light$)
    .map(function (_a) {
    var hue = _a[0], sat = _a[1], light = _a[2];
    return "hsl(" + hue + ", " + sat + "%, " + light + "%)";
});
exports.hexString$ = rxjs_1.Observable.combineLatest(hsl_values_1.hue$, hsl_values_1.sat$, hsl_values_1.light$, function (hue, saturation, lightness) { return ({ hue: hue, saturation: saturation, lightness: lightness }); })
    .map(function (val) { console.log('HSLTORGB', val); return shared_1.HSLtoRGB(val); })
    .map(shared_1.RGBtoHEX)
    .map(function (hex) {
    console.log('hex', hex);
    return ("#" + hex).toUpperCase();
});


/***/ }),

/***/ 166:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = __webpack_require__(59);
var color_control_scrolls_1 = __webpack_require__(167);
/*
 This file exports 3 reactive variables:
 - hue$: Observable<number>
 - sat$: Observable<number>
 - light$: Observable<number>
  ---
  Notes:
 - Operators: .startWith, .scan, .fromEvent
 - Helper: Accumulators
 - Using .filter to limit high-frequency emissions
*/
var ScrollSensitity = 0.001;
exports.hue$ = color_control_scrolls_1.hueScroll$
    .map(function (e) { return e.deltaX; })
    .filter(function (dx) { return dx !== 0; })
    .startWith(0.45 / ScrollSensitity)
    .map(function (value) { return value * ScrollSensitity; })
    .scan(helpers_1.Accumulators.Circular, 0)
    .map(function (ratio) { return Math.round(360 * ratio); });
exports.sat$ = color_control_scrolls_1.satScroll$
    .map(function (e) { return e.deltaY; })
    .filter(function (dy) { return dy !== 0; })
    .startWith(0.8 / ScrollSensitity)
    .map(function (value) { return value * ScrollSensitity; })
    .scan(helpers_1.Accumulators.Clamped, 0)
    .map(function (ratio) { return Math.round(100 * ratio); });
exports.light$ = color_control_scrolls_1.lightScroll$
    .map(function (e) { return e.deltaY; })
    .filter(function (dy) { return dy !== 0; })
    .startWith(0.5 / ScrollSensitity)
    .map(function (value) { return value * ScrollSensitity; })
    .scan(helpers_1.Accumulators.Clamped, 0)
    .map(function (ratio) { return Math.round(100 * ratio); });


/***/ }),

/***/ 167:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = __webpack_require__(14);
/*
 This file exports 3 reactive variables:
 - hueScroll$: Observable<MouseWheelEvent>
 - satScroll$: Observable<MouseWheelEvent>
 - lightScroll$: Observable<MouseWheelEvent>
 ---
 Notes:
 - Using .filter as a control flow mechanism
 - Keeping code super DRY
 - Keeping manipulation of reactivity source state to a minimum
*/
/*
 Implementation 1 (good):
 Capture all .scroll-control and filter by target IDs
*/
// export const hueScroll$
//   = Observable.fromEvent(
//       document.querySelectorAll('#hue-control'),
//       'wheel',
//       (e: MouseWheelEvent) => {
//         e.preventDefault();
//         e.stopPropagation();
//         return e;
//       }
//     );
//
// export const satScroll$
//   = Observable.fromEvent(
//       document.querySelectorAll('#sat-control'),
//       'wheel',
//       (e: MouseWheelEvent) => {
//         e.preventDefault();
//         e.stopPropagation();
//         return e;
//       }
//     );
//
// export const lightScroll$
//   = Observable.fromEvent(
//       document.querySelectorAll('#light-control'),
//       'wheel',
//       (e: MouseWheelEvent) => {
//         e.preventDefault();
//         e.stopPropagation();
//         return e;
//       }
//     );
/*
 Implementation 2 (better):
 Capture all .scroll-control and filter by target IDs
*/
var colorControlScroll$ = rxjs_1.Observable.fromEvent(document.querySelectorAll('.scroll-control'), 'wheel', function (e) {
    e.preventDefault();
    e.stopPropagation();
    return e;
});
exports.hueScroll$ = colorControlScroll$.filter(function (e) { return e.toElement.id === 'hue-control'; });
exports.satScroll$ = colorControlScroll$.filter(function (e) { return e.toElement.id === 'sat-control'; });
exports.lightScroll$ = colorControlScroll$.filter(function (e) { return e.toElement.id === 'light-control'; });


/***/ }),

/***/ 168:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = __webpack_require__(14);
var id = 0;
exports.JSONP = function (url, callbackParamKey, queryParams) {
    if (callbackParamKey === void 0) { callbackParamKey = 'jsonCallback'; }
    if (queryParams === void 0) { queryParams = {}; }
    var jsonpId = id++;
    var callbackId = "jsonp" + jsonpId;
    var callbackParam = callbackParamKey + "=" + callbackId;
    var queryParamString = Object.entries(queryParams).map(function (_a) {
        var k = _a[0], v = _a[1];
        return k + "=" + v;
    }).join('&');
    var paramString = [queryParamString, callbackParam].join('&');
    var src = url + "?" + paramString;
    var script = Object.assign(document.createElement('script'), { src: src });
    var promise = new Promise(function (resolve, reject) {
        window[callbackId] = function (response) {
            script.remove();
            resolve(response);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    });
    return rxjs_1.Observable.from(promise);
};


/***/ }),

/***/ 470:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Rx = __webpack_require__(14);
var rxjs_1 = __webpack_require__(14);
var shared_1 = __webpack_require__(58);
var features_1 = __webpack_require__(164);
var widgets_1 = __webpack_require__(473);
/* Globalize helpers */
window['observeInConsole'] = shared_1.observeInConsole;
window['writeToSelector'] = shared_1.writeToSelector;
/* Globalize RxJS */
window['Rx'] = Rx;
Object.entries(Rx).map(function (_a) {
    var prop = _a[0], value = _a[1];
    return window[prop] = value;
});
console.log(widgets_1.ColorDetailsWidget);
/*
  - Overview of HSL
  Feature #1  Color-changing icons
  - Operators: Observable.interval, .map, .do
  - Helper introduction: writeToSelector
  ---
  Feature #2  Icons stop changing colors when clicked
  - Operators: .take, .takeUntil, .fromEvent
  - Helper: observeInConsole
  ---
  Notes:
  - DOM interactions happens only in the subscribe
  - Data coming through streams is used as-is; no manipulation
*/
/* Create the color-changing icons */
// Icon DOM elements
var icon1 = document.querySelector(shared_1.Selectors.icon1);
var icon2 = document.querySelector(shared_1.Selectors.icon2);
// Icon DOM element clicks
var iconClicks1$ = rxjs_1.Observable.fromEvent(icon1, 'click');
var iconClicks2$ = rxjs_1.Observable.fromEvent(icon2, 'click');
// Activate the icons
features_1.changingHue1$.takeUntil(iconClicks1$).subscribe(function (hue) { return icon1.style.color = "hsl(" + hue + ", 100%, 50%)"; });
features_1.changingHue2$.takeUntil(iconClicks2$).subscribe(function (hue) { return icon2.style.color = "hsl(" + hue + ", 100%, 50%)"; });
features_1.hue$.subscribe(function (hue) { return shared_1.writeToSelector(shared_1.Selectors.hueValue, hue); });
features_1.sat$.subscribe(function (sat) { return shared_1.writeToSelector(shared_1.Selectors.saturationValue, sat); });
features_1.light$.subscribe(function (light) { return shared_1.writeToSelector(shared_1.Selectors.lightnessValue, light); });
//
features_1.hslString$
    .map(function (hslString) { return shared_1.writeToSelector(shared_1.Selectors.hslString, hslString); })
    .subscribe(function (hsl) { return document.body.style.backgroundColor = hsl; });
features_1.gradient$.subscribe(function (gardient) { return document.body.style.background = gardient; });
features_1.hexString$.subscribe(function (hexString) { return shared_1.writeToSelector(shared_1.Selectors.hexString, hexString); });
/*
  Future features:
  - Holding the shift key decreases the scroll sensitivity for fine-tuned scrolling
  - Create a toggle button that changes the scroll control zones between HSL and RGB modes
  - Icon starts changing colors again after having previously been stopped
  - Double-clicking a value displays an input that allows you to enter a numeric value manually
  - Keyboard-only controls (tab key to switch control zones, arrow keys to change value)
*/ 


/***/ }),

/***/ 471:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var color_css_values_1 = __webpack_require__(165);
var GradientStops = 30;
exports.gradient$ = color_css_values_1.hexString$
    .debounceTime(5)
    .startWith('#ffffff')
    .scan(function (hexList, hex) { return [hex].concat(hexList).slice(0, GradientStops); }, [])
    .filter(function (hexList) { return hexList.length > 0; })
    .map(function (hexList) {
    // Set the position of the first (most recent) color so that it takes up the majority of the space
    return hexList
        .map(function (hex, i) { return i === 0 ? hex + " 50%" : hex; })
        .join(', ');
})
    .map(function (gradientStops) { return "linear-gradient(180deg, " + gradientStops + ")"; });


/***/ }),

/***/ 472:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = __webpack_require__(14);
/*
 This file exports 3 reactive variables:
 - changingHue1$: Observable<number>
 - changingHue2$: Observable<number>
  ---
  Notes:
 - Difference between .do and .map
 - Observables that never complete on their own (.fromEvent, .interval)
 - How to force completion
*/
// Icon hues
exports.changingHue1$ = rxjs_1.Observable.interval(23).map(function (i) { return i % 360; });
exports.changingHue2$ = rxjs_1.Observable.interval(40).map(function (i) { return i % 360 * -1; });


/***/ }),

/***/ 473:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(474));


/***/ }),

/***/ 474:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = __webpack_require__(58);
var api_1 = __webpack_require__(475);
var features_1 = __webpack_require__(164);
//
// const widgetSelectors = {
//   colorName: '.color-name'
// };
var hex$ = features_1.hexString$.debounceTime(1000).share();
var colorDetails$ = hex$
    .switchMap(function (hex) {
    return api_1.TheColorApi.getColor(hex);
}
// Observable.concat(
//   // Observable.of('Getting color details'),
// )
);
colorDetails$
    .map(function (color) { return "\n    <div class=\"ui relaxed\">\n        <img class=\"ui avatar image\" src=\"" + color.image.bare + "\">\n        <span class=\"content\">\n          <h1 class=\"header\">" + color.name.value + "</h1>\n          <div class=\"description\">Updated 10 mins ago</div>\n        </span>\n    </div>\n  "; })
    .map(function (htmlString) { return shared_1.htmlFromString(htmlString); })
    .subscribe(function (html) {
    shared_1.replaceContentAtSelector(shared_1.Selectors.colorDetailsWidget, html);
});
var colorDetailsElement = shared_1.htmlFromString("\n  <h1>Color Name</h1>\n");
exports.ColorDetailsWidget = shared_1.replaceContentAtSelector(shared_1.Selectors.colorDetailsWidget, colorDetailsElement);


/***/ }),

/***/ 475:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(476));
__export(__webpack_require__(477));


/***/ }),

/***/ 476:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var jsonp_1 = __webpack_require__(168);
exports.ColourLovers = {
    getColor: function (hex) {
        var url = "https://www.colourlovers.com/api/color/" + hex;
        return jsonp_1.JSONP(url);
    }
};


/***/ }),

/***/ 477:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var jsonp_1 = __webpack_require__(168);
var ColorSchemeMode;
(function (ColorSchemeMode) {
    ColorSchemeMode["Monochrome"] = "monochrome";
    ColorSchemeMode["MonochromeDark"] = "monochrome-dark";
    ColorSchemeMode["MonochromeLight"] = "monochrome-light";
    ColorSchemeMode["Analogic"] = "analogic";
    ColorSchemeMode["Complement"] = "complement";
    ColorSchemeMode["AnalogicComplement"] = "analogic-complement";
    ColorSchemeMode["Triad"] = "triad";
    ColorSchemeMode["Quad"] = "quad";
})(ColorSchemeMode = exports.ColorSchemeMode || (exports.ColorSchemeMode = {}));
exports.TheColorApi = {
    getColor: function (hex) {
        var url = "http://www.thecolorapi.com/id";
        return jsonp_1.JSONP(url, 'callback', {
            format: 'json',
            hex: hex.replace('#', '')
        });
    },
    getColorScheme: function (hex, count, scheme) {
        if (count === void 0) { count = 5; }
        if (scheme === void 0) { scheme = ColorSchemeMode.Monochrome; }
        var url = "http://www.thecolorapi.com/scheme";
        return jsonp_1.JSONP(url, 'callback', {
            format: 'json',
            hex: hex.replace('#', ''),
            mode: scheme,
            count: count
        });
    }
};


/***/ }),

/***/ 58:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(162);
__webpack_require__(163);
__webpack_require__(59);
__export(__webpack_require__(162));
__export(__webpack_require__(163));
__export(__webpack_require__(59));


/***/ }),

/***/ 59:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var nextCss = "color: #fff; background-color: #2196F3;";
var completeCss = "color: #333; background-color: #AEEA00; font-weight: bold;";
var errorCss = "background-color: #ee0000; color: #ffffff; font-weight: bold;";
exports.observeInConsole = function (tag) {
    return ({
        next: function (value) {
            console.log("%c" + tag + " next: ", nextCss, value);
        },
        error: function (err) {
            console.log("%c" + tag + " error: ", errorCss, err);
        },
        complete: function () {
            console.log("%c" + tag + " completed", completeCss);
        }
    });
};
exports.htmlFromString = function (innerHTML) {
    var template = document.createElement('template');
    template.innerHTML = innerHTML;
    if (template.content.children.length !== 1) {
        console.error('A template did not produce a valid HTML Element!', innerHTML);
    }
    /* Extract the first child from the <template> */
    var element = Array.from(template.content.children)[0];
    element.innerHTML = element.innerHTML.trim();
    return element;
};
exports.writeToSelector = function (selector, content) {
    var selection = document.querySelectorAll(selector);
    if (selection.length < 1) {
        throw new Error("Couldn't find any elements using the selector \"" + selector + "\"");
    }
    Array.from(selection)
        .forEach(function (elem) {
        return Object.assign(elem, { innerHTML: content });
    });
    return content;
};
exports.replaceContentAtSelector = function (selector, content) {
    var selection = document.querySelectorAll(selector);
    if (selection.length < 1) {
        throw new Error("Couldn't find any elements using the selector \"" + selector + "\"");
    }
    Array.from(selection)
        .forEach(function (elem) {
        Array.from(elem.children).forEach(function (child) { return child.remove(); });
        elem.appendChild(content);
    });
    return content;
};
exports.Accumulators = {
    Circular: function (value, change) {
        var nextValue = value + change;
        return change < 0
            ? (nextValue < 0 ? (nextValue + 1) : nextValue)
            : (nextValue >= 1 ? (nextValue - 1) : nextValue);
    },
    Clamped: function (value, change) {
        var nextValue = value + change;
        return change < 0
            ? (nextValue < 0 ? 0 : nextValue)
            : (nextValue >= 1 ? 1 : nextValue);
    }
};


/***/ })

},[470]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zaGFyZWQvY29sb3IudHMiLCJ3ZWJwYWNrOi8vLy4vc2hhcmVkL2NvbnN0YW50cy50cyIsIndlYnBhY2s6Ly8vLi9mZWF0dXJlcy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9mZWF0dXJlcy9jb2xvci1jc3MtdmFsdWVzLnRzIiwid2VicGFjazovLy8uL2ZlYXR1cmVzL2hzbC12YWx1ZXMudHMiLCJ3ZWJwYWNrOi8vLy4vZmVhdHVyZXMvY29sb3ItY29udHJvbC1zY3JvbGxzLnRzIiwid2VicGFjazovLy8uL2FwaS9qc29ucC50cyIsIndlYnBhY2s6Ly8vLi9tYWluLnRzIiwid2VicGFjazovLy8uL2ZlYXR1cmVzL2JhY2tncm91bmQtZ3JhZGllbnQudHMiLCJ3ZWJwYWNrOi8vLy4vZmVhdHVyZXMvY29sb3ItY2hhbmdlLWljb24udHMiLCJ3ZWJwYWNrOi8vLy4vd2lkZ2V0cy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi93aWRnZXRzL2NvbG9yLWRldGFpbHMud2lkZ2V0LnRzIiwid2VicGFjazovLy8uL2FwaS9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9hcGkvY29sb3VyLWxvdmVycy5hcGkudHMiLCJ3ZWJwYWNrOi8vLy4vYXBpL3RoZS1jb2xvci1hcGkuYXBpLnRzIiwid2VicGFjazovLy8uL3NoYXJlZC9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zaGFyZWQvaGVscGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQThCYSxnQkFBUSxHQUNuQixVQUFDLEVBQXVCO1FBQXRCLFlBQUcsRUFBRSxnQkFBSyxFQUFFLGNBQUk7SUFDaEIsSUFBTSxJQUFJLEdBQUcsUUFBSyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBRyxFQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9DLElBQU0sSUFBSSxHQUFHLFFBQUssS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUcsRUFBQyxLQUFLLENB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QUMsU0FBUyxDQUFDO1lBQy9DLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBQ0QsT0FBTyxZQUFDLEtBQUssRUFBRSxNQUFNO1FBQ25CLElBQU0sU0FBUyxHQUFHLEtBQUssR0FBRyxNQUFNLENBQUM7UUFDakMsT0FBTyxNQUFNLEdBQUcsQ0FBQztZQUNmLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQ2pDLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDdkMsQ0FBQztDQUNGLENBQUMiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBSR0Ige1xuICByZWQ6IG51bWJlcjtcbiAgZ3JlZW46IG51bWJlcjtcbiAgYmx1ZTogbnVtYmVyO1xufVxuZXhwb3J0IGludGVyZmFjZSBIU1Yge1xuICBodWU6IG51bWJlcjtcbiAgc2F0dXJhdGlvbjogbnVtYmVyO1xuICB2YWx1ZTogbnVtYmVyO1xufVxuZXhwb3J0IHR5cGUgSEVYID0gc3RyaW5nO1xuZXhwb3J0IGludGVyZmFjZSBIU0wge1xuICBodWU6IG51bWJlcjtcbiAgc2F0dXJhdGlvbjogbnVtYmVyO1xuICBsaWdodG5lc3M6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBYWVoge1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbiAgejogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENNWUsge1xuICBjOiBudW1iZXI7XG4gIG06IG51bWJlcjtcbiAgeTogbnVtYmVyO1xuICBrOiBudW1iZXI7XG59XG5cbmV4cG9ydCBjb25zdCBSR0J0b0hFWCA9XG4gICh7cmVkLCBncmVlbiwgYmx1ZX06IFJHQik6IEhFWCA9PiB7XG4gICAgY29uc3QgckhleCA9IGAwMCR7cmVkLnRvU3RyaW5nKDE2KX1gLnNsaWNlKC0yKTtcbiAgICBjb25zdCBnSGV4ID0gYDAwJHtncmVlbi50b1N0cmluZygxNil9YC5zbGljZSgtMik7XG4gICAgY29uc3QgYkhleCA9IGAwMCR7Ymx1ZS50b1N0cmluZygxNil9YC5zbGljZSgtMik7XG4gICAgcmV0dXJuIHJIZXggKyBnSGV4ICsgYkhleDtcbiAgfTtcbmNvbnN0IGh4Y21Ub1JnYiA9XG4gIChIOiBudW1iZXIsIFg6IG51bWJlciwgQzogbnVtYmVyLCBNOiBudW1iZXIpOiBSR0IgPT4ge1xuICAgIGNvbnN0IGhSYW5nZSA9IE1hdGguY2VpbChILzEwKSAlIDY7XG4gICAgY29uc29sZS5sb2coYEh1ZTogJHtIfSwgcmFuZ2U6ICR7aFJhbmdlfWApO1xuICAgIGNvbnN0IHRvUmdiID1cbiAgICAgIChyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyKTogUkdCID0+IHtcbiAgICAgICAgY29uc3QgcmVkID0gTWF0aC5yb3VuZCgociArIE0pICogMjU1KTtcbiAgICAgICAgY29uc3QgZ3JlZW4gPSBNYXRoLnJvdW5kKChnICsgTSkgKiAyNTUpO1xuICAgICAgICBjb25zdCBibHVlID0gTWF0aC5yb3VuZCgoYiArIE0pICogMjU1KTtcbiAgICAgICAgcmV0dXJuIHsgcmVkLCBncmVlbiwgYmx1ZSB9O1xuICAgICAgfTtcbiAgICBpZihIIDwgNjApIHJldHVybiB0b1JnYihDLCBYLCAwKTtcbiAgICBlbHNlIGlmKEggPCAxMjApIHJldHVybiB0b1JnYihYLCBDLCAwKTtcbiAgICBlbHNlIGlmKEggPCAxODApIHJldHVybiB0b1JnYigwLCBDLCBYKTtcbiAgICBlbHNlIGlmKEggPCAyNDApIHJldHVybiB0b1JnYigwLCBYLCBDKTtcbiAgICBlbHNlIGlmKEggPCAzMDApIHJldHVybiB0b1JnYihYLCAwLCBDKTtcbiAgICBlbHNlIHJldHVybiB0b1JnYihDLCAwLCBYKTtcbiAgfTtcbmV4cG9ydCBjb25zdCBIU0x0b1JHQiA9XG4gICh7aHVlOiBILCBzYXR1cmF0aW9uLCBsaWdodG5lc3N9OiBIU0wpOiBSR0IgPT4ge1xuICAgIGNvbnN0IFMgPSBzYXR1cmF0aW9uLzEwMDtcbiAgICBjb25zdCBMID0gbGlnaHRuZXNzLzEwMDtcbiAgICBjb25zdCBDID0gKDEgLSBNYXRoLmFicygyKkwgLSAxKSkgKiBTO1xuICAgIGNvbnN0IFggPSBDICogKDEgLSBNYXRoLmFicygoSC82MCklMiAtIDEpKTtcbiAgICBjb25zdCBtID0gTCAtIEMvMjtcbiAgICByZXR1cm4gaHhjbVRvUmdiKEgsIFgsIEMsIG0pO1xuICB9O1xuZXhwb3J0IGNvbnN0IEhTVnRvUkdCID1cbiAgKHtodWU6IEgsIHNhdHVyYXRpb24sIHZhbHVlfTogSFNWKTogUkdCID0+IHtcbiAgICBjb25zdCBTID0gc2F0dXJhdGlvbi8xMDA7XG4gICAgY29uc3QgViA9IHZhbHVlIC8gMTAwO1xuICAgIGNvbnN0IEMgPSBWICogUztcbiAgICBjb25zdCBYID0gQyAqICgxIC0gTWF0aC5hYnMoKEgvNjApJTIgLSAxKSk7XG4gICAgY29uc3QgbSA9IFYgLSBDO1xuICAgIHJldHVybiBoeGNtVG9SZ2IoSCwgWCwgQywgbSk7XG4gIH07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2hhcmVkL2NvbG9yLnRzIiwiZXhwb3J0IGNvbnN0IFNlbGVjdG9ycyA9IHtcbiAgaGVhZGVyVGV4dDogJyNjb2xvci1zY3JvbGwtaWNvbi10ZXh0JyxcbiAgaWNvbjE6ICcjY29sb3Itc2Nyb2xsLWljb24tMScsXG4gIGljb24yOiAnI2NvbG9yLXNjcm9sbC1pY29uLTInLFxuICBodWVWYWx1ZTogJy5odWUtdmFsdWUnLFxuICBzYXR1cmF0aW9uVmFsdWU6ICcuc2F0dXJhdGlvbi12YWx1ZScsXG4gIGxpZ2h0bmVzc1ZhbHVlOiAnLmxpZ2h0bmVzcy12YWx1ZScsXG4gIGhzbFN0cmluZzogJy5oc2wtc3RyaW5nJyxcbiAgaGV4U3RyaW5nOiAnLmhleC1zdHJpbmcnLFxuICBjb2xvckRldGFpbHNXaWRnZXQ6ICcjY29sb3ItZGV0YWlscy13aWRnZXQnXG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NoYXJlZC9jb25zdGFudHMudHMiLCJleHBvcnQgKiBmcm9tICcuL2JhY2tncm91bmQtZ3JhZGllbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9jb2xvci1jaGFuZ2UtaWNvbic7XG5leHBvcnQgKiBmcm9tICcuL2NvbG9yLWNvbnRyb2wtc2Nyb2xscyc7XG5leHBvcnQgKiBmcm9tICcuL2hzbC12YWx1ZXMnO1xuZXhwb3J0ICogZnJvbSAnLi9jb2xvci1jc3MtdmFsdWVzJztcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9mZWF0dXJlcy9pbmRleC50cyIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEhTTHRvUkdCLCBSR0J0b0hFWCwgSFNMIH0gZnJvbSAnLi4vc2hhcmVkJztcbmltcG9ydCB7IGh1ZSQsIHNhdCQsIGxpZ2h0JCB9IGZyb20gJy4vaHNsLXZhbHVlcyc7XG4vKlxuIFRoaXMgZmlsZSBleHBvcnRzIDEgcmVhY3RpdmUgdmFyaWFibGVzOlxuIC0gaHNsU3RyaW5nJDogT2JzZXJ2YWJsZTxzdHJpbmc+XG4gLS0tXG4gTm90ZXM6XG4gLSBPcGVyYXRvcnM6IC5jb21iaW5lTGF0ZXN0XG4qL1xuZXhwb3J0IGNvbnN0IGhzbFN0cmluZyRcbiAgPSBPYnNlcnZhYmxlLmNvbWJpbmVMYXRlc3QoaHVlJCwgc2F0JCwgbGlnaHQkKVxuICAubWFwKChbaHVlLCBzYXQsIGxpZ2h0XSkgPT4gYGhzbCgke2h1ZX0sICR7c2F0fSUsICR7bGlnaHR9JSlgKTtcblxuZXhwb3J0IGNvbnN0IGhleFN0cmluZyRcbiAgPSBPYnNlcnZhYmxlLmNvbWJpbmVMYXRlc3QoaHVlJCwgc2F0JCwgbGlnaHQkLCAoaHVlLCBzYXR1cmF0aW9uLCBsaWdodG5lc3MpOiBIU0wgPT4gKHsgaHVlLCBzYXR1cmF0aW9uLCBsaWdodG5lc3MgfSkpXG4gIC5tYXAoKHZhbCk9PnsgY29uc29sZS5sb2coJ0hTTFRPUkdCJywgdmFsKTsgcmV0dXJuIEhTTHRvUkdCKHZhbCl9KVxuICAubWFwKFJHQnRvSEVYKVxuICAubWFwKGhleCA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnaGV4JywgaGV4KTtcbiAgICByZXR1cm4gYCMke2hleH1gLnRvVXBwZXJDYXNlKCl9KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9mZWF0dXJlcy9jb2xvci1jc3MtdmFsdWVzLnRzIiwiaW1wb3J0IHsgQWNjdW11bGF0b3JzIH0gZnJvbSAnLi4vc2hhcmVkL2hlbHBlcnMnO1xuaW1wb3J0IHsgaHVlU2Nyb2xsJCwgc2F0U2Nyb2xsJCwgbGlnaHRTY3JvbGwkIH0gZnJvbSAnLi9jb2xvci1jb250cm9sLXNjcm9sbHMnO1xuLypcbiBUaGlzIGZpbGUgZXhwb3J0cyAzIHJlYWN0aXZlIHZhcmlhYmxlczpcbiAtIGh1ZSQ6IE9ic2VydmFibGU8bnVtYmVyPlxuIC0gc2F0JDogT2JzZXJ2YWJsZTxudW1iZXI+XG4gLSBsaWdodCQ6IE9ic2VydmFibGU8bnVtYmVyPlxuICAtLS1cbiAgTm90ZXM6XG4gLSBPcGVyYXRvcnM6IC5zdGFydFdpdGgsIC5zY2FuLCAuZnJvbUV2ZW50XG4gLSBIZWxwZXI6IEFjY3VtdWxhdG9yc1xuIC0gVXNpbmcgLmZpbHRlciB0byBsaW1pdCBoaWdoLWZyZXF1ZW5jeSBlbWlzc2lvbnNcbiovXG5jb25zdCBTY3JvbGxTZW5zaXRpdHkgPSAwLjAwMTtcblxuZXhwb3J0IGNvbnN0IGh1ZSRcbiAgPSBodWVTY3JvbGwkXG4gIC5tYXAoZSA9PiBlLmRlbHRhWClcbiAgLmZpbHRlcihkeCA9PiBkeCAhPT0gMClcbiAgLnN0YXJ0V2l0aCgwLjQ1IC8gU2Nyb2xsU2Vuc2l0aXR5KVxuICAubWFwKHZhbHVlID0+IHZhbHVlICogU2Nyb2xsU2Vuc2l0aXR5KVxuICAuc2NhbihBY2N1bXVsYXRvcnMuQ2lyY3VsYXIsIDApXG4gIC5tYXAocmF0aW8gPT4gTWF0aC5yb3VuZCgzNjAgKiByYXRpbykpO1xuXG5leHBvcnQgY29uc3Qgc2F0JFxuICA9IHNhdFNjcm9sbCRcbiAgLm1hcChlID0+IGUuZGVsdGFZKVxuICAuZmlsdGVyKGR5ID0+IGR5ICE9PSAwKVxuICAuc3RhcnRXaXRoKDAuOCAvIFNjcm9sbFNlbnNpdGl0eSlcbiAgLm1hcCh2YWx1ZSA9PiB2YWx1ZSAqIFNjcm9sbFNlbnNpdGl0eSlcbiAgLnNjYW4oQWNjdW11bGF0b3JzLkNsYW1wZWQsIDApXG4gIC5tYXAocmF0aW8gPT4gTWF0aC5yb3VuZCgxMDAgKiByYXRpbykpO1xuXG5leHBvcnQgY29uc3QgbGlnaHQkXG4gID0gbGlnaHRTY3JvbGwkXG4gIC5tYXAoZSA9PiBlLmRlbHRhWSlcbiAgLmZpbHRlcihkeSA9PiBkeSAhPT0gMClcbiAgLnN0YXJ0V2l0aCgwLjUgLyBTY3JvbGxTZW5zaXRpdHkpXG4gIC5tYXAodmFsdWUgPT4gdmFsdWUgKiBTY3JvbGxTZW5zaXRpdHkpXG4gIC5zY2FuKEFjY3VtdWxhdG9ycy5DbGFtcGVkLCAwKVxuICAubWFwKHJhdGlvID0+IE1hdGgucm91bmQoMTAwICogcmF0aW8pKTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9mZWF0dXJlcy9oc2wtdmFsdWVzLnRzIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuLypcbiBUaGlzIGZpbGUgZXhwb3J0cyAzIHJlYWN0aXZlIHZhcmlhYmxlczpcbiAtIGh1ZVNjcm9sbCQ6IE9ic2VydmFibGU8TW91c2VXaGVlbEV2ZW50PlxuIC0gc2F0U2Nyb2xsJDogT2JzZXJ2YWJsZTxNb3VzZVdoZWVsRXZlbnQ+XG4gLSBsaWdodFNjcm9sbCQ6IE9ic2VydmFibGU8TW91c2VXaGVlbEV2ZW50PlxuIC0tLVxuIE5vdGVzOlxuIC0gVXNpbmcgLmZpbHRlciBhcyBhIGNvbnRyb2wgZmxvdyBtZWNoYW5pc21cbiAtIEtlZXBpbmcgY29kZSBzdXBlciBEUllcbiAtIEtlZXBpbmcgbWFuaXB1bGF0aW9uIG9mIHJlYWN0aXZpdHkgc291cmNlIHN0YXRlIHRvIGEgbWluaW11bVxuKi9cbi8qXG4gSW1wbGVtZW50YXRpb24gMSAoZ29vZCk6XG4gQ2FwdHVyZSBhbGwgLnNjcm9sbC1jb250cm9sIGFuZCBmaWx0ZXIgYnkgdGFyZ2V0IElEc1xuKi9cbi8vIGV4cG9ydCBjb25zdCBodWVTY3JvbGwkXG4vLyAgID0gT2JzZXJ2YWJsZS5mcm9tRXZlbnQoXG4vLyAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjaHVlLWNvbnRyb2wnKSxcbi8vICAgICAgICd3aGVlbCcsXG4vLyAgICAgICAoZTogTW91c2VXaGVlbEV2ZW50KSA9PiB7XG4vLyAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbi8vICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbi8vICAgICAgICAgcmV0dXJuIGU7XG4vLyAgICAgICB9XG4vLyAgICAgKTtcbi8vXG4vLyBleHBvcnQgY29uc3Qgc2F0U2Nyb2xsJFxuLy8gICA9IE9ic2VydmFibGUuZnJvbUV2ZW50KFxuLy8gICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI3NhdC1jb250cm9sJyksXG4vLyAgICAgICAnd2hlZWwnLFxuLy8gICAgICAgKGU6IE1vdXNlV2hlZWxFdmVudCkgPT4ge1xuLy8gICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4vLyAgICAgICAgIHJldHVybiBlO1xuLy8gICAgICAgfVxuLy8gICAgICk7XG4vL1xuLy8gZXhwb3J0IGNvbnN0IGxpZ2h0U2Nyb2xsJFxuLy8gICA9IE9ic2VydmFibGUuZnJvbUV2ZW50KFxuLy8gICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI2xpZ2h0LWNvbnRyb2wnKSxcbi8vICAgICAgICd3aGVlbCcsXG4vLyAgICAgICAoZTogTW91c2VXaGVlbEV2ZW50KSA9PiB7XG4vLyAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbi8vICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbi8vICAgICAgICAgcmV0dXJuIGU7XG4vLyAgICAgICB9XG4vLyAgICAgKTtcbi8qXG4gSW1wbGVtZW50YXRpb24gMiAoYmV0dGVyKTpcbiBDYXB0dXJlIGFsbCAuc2Nyb2xsLWNvbnRyb2wgYW5kIGZpbHRlciBieSB0YXJnZXQgSURzXG4qL1xuY29uc3QgY29sb3JDb250cm9sU2Nyb2xsJFxuICA9IE9ic2VydmFibGUuZnJvbUV2ZW50KFxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2Nyb2xsLWNvbnRyb2wnKSxcbiAgJ3doZWVsJyxcbiAgKGU6IE1vdXNlV2hlZWxFdmVudCkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHJldHVybiBlO1xuICB9XG4pO1xuZXhwb3J0IGNvbnN0IGh1ZVNjcm9sbCQgPSBjb2xvckNvbnRyb2xTY3JvbGwkLmZpbHRlcihlID0+IGUudG9FbGVtZW50LmlkID09PSAnaHVlLWNvbnRyb2wnKTtcbmV4cG9ydCBjb25zdCBzYXRTY3JvbGwkID0gY29sb3JDb250cm9sU2Nyb2xsJC5maWx0ZXIoZSA9PiBlLnRvRWxlbWVudC5pZCA9PT0gJ3NhdC1jb250cm9sJyk7XG5leHBvcnQgY29uc3QgbGlnaHRTY3JvbGwkID0gY29sb3JDb250cm9sU2Nyb2xsJC5maWx0ZXIoZSA9PiBlLnRvRWxlbWVudC5pZCA9PT0gJ2xpZ2h0LWNvbnRyb2wnKTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9mZWF0dXJlcy9jb2xvci1jb250cm9sLXNjcm9sbHMudHMiLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5sZXQgaWQgPSAwO1xuZXhwb3J0IGNvbnN0IEpTT05QID1cbiAgPFQ+KHVybDogc3RyaW5nLCBjYWxsYmFja1BhcmFtS2V5ID0gJ2pzb25DYWxsYmFjaycsIHF1ZXJ5UGFyYW1zOiB7W3BhcmFtOiBzdHJpbmddOiBzdHJpbmd8bnVtYmVyfSA9IHt9KTogT2JzZXJ2YWJsZTxUPiA9PiB7XG4gICAgY29uc3QganNvbnBJZCA9IGlkKys7XG4gICAgY29uc3QgY2FsbGJhY2tJZCA9IGBqc29ucCR7anNvbnBJZH1gO1xuICAgIGNvbnN0IGNhbGxiYWNrUGFyYW0gPSBgJHtjYWxsYmFja1BhcmFtS2V5fT0ke2NhbGxiYWNrSWR9YDtcbiAgICBjb25zdCBxdWVyeVBhcmFtU3RyaW5nID0gT2JqZWN0LmVudHJpZXMocXVlcnlQYXJhbXMpLm1hcCgoW2ssIHZdKSA9PiBgJHtrfT0ke3Z9YCkuam9pbignJicpO1xuICAgIGNvbnN0IHBhcmFtU3RyaW5nID0gW3F1ZXJ5UGFyYW1TdHJpbmcsIGNhbGxiYWNrUGFyYW1dLmpvaW4oJyYnKTtcbiAgICBjb25zdCBzcmMgPSBgJHt1cmx9PyR7cGFyYW1TdHJpbmd9YDtcbiAgICBjb25zdCBzY3JpcHQgPSBPYmplY3QuYXNzaWduKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpLCB7IHNyYyB9KTtcbiAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2U8VD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgd2luZG93W2NhbGxiYWNrSWRdID0gKHJlc3BvbnNlOiBUKSA9PiB7XG4gICAgICAgIHNjcmlwdC5yZW1vdmUoKTtcbiAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICB9O1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgIH0pO1xuICAgIHJldHVybiBPYnNlcnZhYmxlLmZyb20ocHJvbWlzZSk7XG4gIH07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBpL2pzb25wLnRzIiwiaW1wb3J0ICogYXMgUnggZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBTZWxlY3RvcnMsIHdyaXRlVG9TZWxlY3Rvciwgb2JzZXJ2ZUluQ29uc29sZSB9IGZyb20gJy4vc2hhcmVkJztcbmltcG9ydCB7IGNoYW5naW5nSHVlMSQsIGNoYW5naW5nSHVlMiQsIGh1ZSQsIHNhdCQsIGxpZ2h0JCwgaHNsU3RyaW5nJCwgaGV4U3RyaW5nJCwgZ3JhZGllbnQkIH0gZnJvbSAnLi9mZWF0dXJlcyc7XG5pbXBvcnQgeyBDb2xvckRldGFpbHNXaWRnZXQgfSBmcm9tICcuL3dpZGdldHMnO1xuXG4vKiBHbG9iYWxpemUgaGVscGVycyAqL1xud2luZG93WydvYnNlcnZlSW5Db25zb2xlJ10gPSBvYnNlcnZlSW5Db25zb2xlO1xud2luZG93Wyd3cml0ZVRvU2VsZWN0b3InXSA9IHdyaXRlVG9TZWxlY3RvcjtcblxuLyogR2xvYmFsaXplIFJ4SlMgKi9cbndpbmRvd1snUngnXSA9IFJ4O1xuT2JqZWN0LmVudHJpZXMoUngpLm1hcCgoW3Byb3AsIHZhbHVlXSkgPT4gd2luZG93W3Byb3BdID0gdmFsdWUpO1xuXG5cbmNvbnNvbGUubG9nKENvbG9yRGV0YWlsc1dpZGdldCk7XG4vKlxuICAtIE92ZXJ2aWV3IG9mIEhTTFxuICBGZWF0dXJlICMxICBDb2xvci1jaGFuZ2luZyBpY29uc1xuICAtIE9wZXJhdG9yczogT2JzZXJ2YWJsZS5pbnRlcnZhbCwgLm1hcCwgLmRvXG4gIC0gSGVscGVyIGludHJvZHVjdGlvbjogd3JpdGVUb1NlbGVjdG9yXG4gIC0tLVxuICBGZWF0dXJlICMyICBJY29ucyBzdG9wIGNoYW5naW5nIGNvbG9ycyB3aGVuIGNsaWNrZWRcbiAgLSBPcGVyYXRvcnM6IC50YWtlLCAudGFrZVVudGlsLCAuZnJvbUV2ZW50XG4gIC0gSGVscGVyOiBvYnNlcnZlSW5Db25zb2xlXG4gIC0tLVxuICBOb3RlczpcbiAgLSBET00gaW50ZXJhY3Rpb25zIGhhcHBlbnMgb25seSBpbiB0aGUgc3Vic2NyaWJlXG4gIC0gRGF0YSBjb21pbmcgdGhyb3VnaCBzdHJlYW1zIGlzIHVzZWQgYXMtaXM7IG5vIG1hbmlwdWxhdGlvblxuKi9cblxuLyogQ3JlYXRlIHRoZSBjb2xvci1jaGFuZ2luZyBpY29ucyAqL1xuLy8gSWNvbiBET00gZWxlbWVudHNcbmNvbnN0IGljb24xID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihTZWxlY3RvcnMuaWNvbjEpIGFzIEhUTUxFbGVtZW50O1xuY29uc3QgaWNvbjIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFNlbGVjdG9ycy5pY29uMikgYXMgSFRNTEVsZW1lbnQ7XG5cbi8vIEljb24gRE9NIGVsZW1lbnQgY2xpY2tzXG5jb25zdCBpY29uQ2xpY2tzMSQgPSBPYnNlcnZhYmxlLmZyb21FdmVudChpY29uMSwgJ2NsaWNrJyk7XG5jb25zdCBpY29uQ2xpY2tzMiQgPSBPYnNlcnZhYmxlLmZyb21FdmVudChpY29uMiwgJ2NsaWNrJyk7XG5cbi8vIEFjdGl2YXRlIHRoZSBpY29uc1xuY2hhbmdpbmdIdWUxJC50YWtlVW50aWwoaWNvbkNsaWNrczEkKS5zdWJzY3JpYmUoaHVlID0+IGljb24xLnN0eWxlLmNvbG9yID0gYGhzbCgke2h1ZX0sIDEwMCUsIDUwJSlgKTtcbmNoYW5naW5nSHVlMiQudGFrZVVudGlsKGljb25DbGlja3MyJCkuc3Vic2NyaWJlKGh1ZSA9PiBpY29uMi5zdHlsZS5jb2xvciA9IGBoc2woJHtodWV9LCAxMDAlLCA1MCUpYCk7XG5cbmh1ZSQuc3Vic2NyaWJlKGh1ZSA9PiB3cml0ZVRvU2VsZWN0b3IoU2VsZWN0b3JzLmh1ZVZhbHVlLCBodWUpKTtcbnNhdCQuc3Vic2NyaWJlKHNhdCA9PiB3cml0ZVRvU2VsZWN0b3IoU2VsZWN0b3JzLnNhdHVyYXRpb25WYWx1ZSwgc2F0KSk7XG5saWdodCQuc3Vic2NyaWJlKGxpZ2h0ID0+IHdyaXRlVG9TZWxlY3RvcihTZWxlY3RvcnMubGlnaHRuZXNzVmFsdWUsIGxpZ2h0KSk7XG5cbi8vXG5oc2xTdHJpbmckXG4gIC5tYXAoaHNsU3RyaW5nID0+IHdyaXRlVG9TZWxlY3RvcihTZWxlY3RvcnMuaHNsU3RyaW5nLCBoc2xTdHJpbmcpKVxuICAuc3Vic2NyaWJlKGhzbCA9PiBkb2N1bWVudC5ib2R5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGhzbCk7XG5cbmdyYWRpZW50JC5zdWJzY3JpYmUoZ2FyZGllbnQgPT4gZG9jdW1lbnQuYm9keS5zdHlsZS5iYWNrZ3JvdW5kID0gZ2FyZGllbnQpO1xuXG5oZXhTdHJpbmckLnN1YnNjcmliZShoZXhTdHJpbmcgPT4gd3JpdGVUb1NlbGVjdG9yKFNlbGVjdG9ycy5oZXhTdHJpbmcsIGhleFN0cmluZykpO1xuXG5cbi8qXG4gIEZ1dHVyZSBmZWF0dXJlczpcbiAgLSBIb2xkaW5nIHRoZSBzaGlmdCBrZXkgZGVjcmVhc2VzIHRoZSBzY3JvbGwgc2Vuc2l0aXZpdHkgZm9yIGZpbmUtdHVuZWQgc2Nyb2xsaW5nXG4gIC0gQ3JlYXRlIGEgdG9nZ2xlIGJ1dHRvbiB0aGF0IGNoYW5nZXMgdGhlIHNjcm9sbCBjb250cm9sIHpvbmVzIGJldHdlZW4gSFNMIGFuZCBSR0IgbW9kZXNcbiAgLSBJY29uIHN0YXJ0cyBjaGFuZ2luZyBjb2xvcnMgYWdhaW4gYWZ0ZXIgaGF2aW5nIHByZXZpb3VzbHkgYmVlbiBzdG9wcGVkXG4gIC0gRG91YmxlLWNsaWNraW5nIGEgdmFsdWUgZGlzcGxheXMgYW4gaW5wdXQgdGhhdCBhbGxvd3MgeW91IHRvIGVudGVyIGEgbnVtZXJpYyB2YWx1ZSBtYW51YWxseVxuICAtIEtleWJvYXJkLW9ubHkgY29udHJvbHMgKHRhYiBrZXkgdG8gc3dpdGNoIGNvbnRyb2wgem9uZXMsIGFycm93IGtleXMgdG8gY2hhbmdlIHZhbHVlKVxuKi9cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9tYWluLnRzIiwiaW1wb3J0IHsgaGV4U3RyaW5nJCB9IGZyb20gJy4vY29sb3ItY3NzLXZhbHVlcyc7XG5jb25zdCBHcmFkaWVudFN0b3BzID0gMzA7XG5leHBvcnQgY29uc3QgZ3JhZGllbnQkXG4gID0gaGV4U3RyaW5nJFxuICAuZGVib3VuY2VUaW1lKDUpXG4gIC5zdGFydFdpdGgoJyNmZmZmZmYnKVxuICAuc2NhbigoaGV4TGlzdCwgaGV4KSA9PiBbaGV4LCAuLi5oZXhMaXN0XS5zbGljZSgwLCBHcmFkaWVudFN0b3BzKSwgW10pXG4gIC5maWx0ZXIoaGV4TGlzdCA9PiBoZXhMaXN0Lmxlbmd0aCA+IDApXG4gIC5tYXAoaGV4TGlzdCA9PlxuICAgIC8vIFNldCB0aGUgcG9zaXRpb24gb2YgdGhlIGZpcnN0IChtb3N0IHJlY2VudCkgY29sb3Igc28gdGhhdCBpdCB0YWtlcyB1cCB0aGUgbWFqb3JpdHkgb2YgdGhlIHNwYWNlXG4gICAgaGV4TGlzdFxuICAgICAgLm1hcCgoaGV4LCBpKSA9PiBpID09PSAwID8gYCR7aGV4fSA1MCVgIDogaGV4KVxuICAgICAgLmpvaW4oJywgJylcbiAgKVxuICAubWFwKGdyYWRpZW50U3RvcHMgPT4gYGxpbmVhci1ncmFkaWVudCgxODBkZWcsICR7Z3JhZGllbnRTdG9wc30pYCk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZmVhdHVyZXMvYmFja2dyb3VuZC1ncmFkaWVudC50cyIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbi8qXG4gVGhpcyBmaWxlIGV4cG9ydHMgMyByZWFjdGl2ZSB2YXJpYWJsZXM6XG4gLSBjaGFuZ2luZ0h1ZTEkOiBPYnNlcnZhYmxlPG51bWJlcj5cbiAtIGNoYW5naW5nSHVlMiQ6IE9ic2VydmFibGU8bnVtYmVyPlxuICAtLS1cbiAgTm90ZXM6XG4gLSBEaWZmZXJlbmNlIGJldHdlZW4gLmRvIGFuZCAubWFwXG4gLSBPYnNlcnZhYmxlcyB0aGF0IG5ldmVyIGNvbXBsZXRlIG9uIHRoZWlyIG93biAoLmZyb21FdmVudCwgLmludGVydmFsKVxuIC0gSG93IHRvIGZvcmNlIGNvbXBsZXRpb25cbiovXG4vLyBJY29uIGh1ZXNcbmV4cG9ydCBjb25zdCBjaGFuZ2luZ0h1ZTEkID0gT2JzZXJ2YWJsZS5pbnRlcnZhbCgyMykubWFwKGkgPT4gaSAlIDM2MCk7XG5leHBvcnQgY29uc3QgY2hhbmdpbmdIdWUyJCA9IE9ic2VydmFibGUuaW50ZXJ2YWwoNDApLm1hcChpID0+IGkgJSAzNjAgKiAtMSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZmVhdHVyZXMvY29sb3ItY2hhbmdlLWljb24udHMiLCJleHBvcnQgKiBmcm9tICcuL2NvbG9yLWRldGFpbHMud2lkZ2V0JztcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi93aWRnZXRzL2luZGV4LnRzIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgU2VsZWN0b3JzLCByZXBsYWNlQ29udGVudEF0U2VsZWN0b3IsIGh0bWxGcm9tU3RyaW5nLyosIG9ic2VydmVJbkNvbnNvbGUqLyB9IGZyb20gJy4uL3NoYXJlZCc7XG5pbXBvcnQgeyBUaGVDb2xvckFwaSwgQ29sb3IgfSBmcm9tICcuLi9hcGknO1xuaW1wb3J0IHsgaGV4U3RyaW5nJCB9IGZyb20gJy4uL2ZlYXR1cmVzJztcbi8vXG4vLyBjb25zdCB3aWRnZXRTZWxlY3RvcnMgPSB7XG4vLyAgIGNvbG9yTmFtZTogJy5jb2xvci1uYW1lJ1xuLy8gfTtcblxuY29uc3QgaGV4JCA9IGhleFN0cmluZyQuZGVib3VuY2VUaW1lKDEwMDApLnNoYXJlKCk7XG5cblxuY29uc3QgY29sb3JEZXRhaWxzJDogT2JzZXJ2YWJsZTxDb2xvcj5cbiAgPSBoZXgkXG4gIC5zd2l0Y2hNYXAoaGV4ID0+XG4gICAgICBUaGVDb2xvckFwaS5nZXRDb2xvcihoZXgpXG4gICAgLy8gT2JzZXJ2YWJsZS5jb25jYXQoXG4gICAgLy8gICAvLyBPYnNlcnZhYmxlLm9mKCdHZXR0aW5nIGNvbG9yIGRldGFpbHMnKSxcbiAgICAvLyApXG4gICk7XG5cblxuY29sb3JEZXRhaWxzJFxuICAubWFwKGNvbG9yID0+IGBcbiAgICA8ZGl2IGNsYXNzPVwidWkgcmVsYXhlZFwiPlxuICAgICAgICA8aW1nIGNsYXNzPVwidWkgYXZhdGFyIGltYWdlXCIgc3JjPVwiJHtjb2xvci5pbWFnZS5iYXJlfVwiPlxuICAgICAgICA8c3BhbiBjbGFzcz1cImNvbnRlbnRcIj5cbiAgICAgICAgICA8aDEgY2xhc3M9XCJoZWFkZXJcIj4ke2NvbG9yLm5hbWUudmFsdWV9PC9oMT5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGVzY3JpcHRpb25cIj5VcGRhdGVkIDEwIG1pbnMgYWdvPC9kaXY+XG4gICAgICAgIDwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgYClcbiAgLm1hcChodG1sU3RyaW5nID0+IGh0bWxGcm9tU3RyaW5nKGh0bWxTdHJpbmcpKVxuICAuc3Vic2NyaWJlKGh0bWwgPT4ge1xuICAgIHJlcGxhY2VDb250ZW50QXRTZWxlY3RvcihTZWxlY3RvcnMuY29sb3JEZXRhaWxzV2lkZ2V0LCBodG1sKTtcbiAgfSk7XG5cbmNvbnN0IGNvbG9yRGV0YWlsc0VsZW1lbnQgPSBodG1sRnJvbVN0cmluZyhgXG4gIDxoMT5Db2xvciBOYW1lPC9oMT5cbmApO1xuXG5leHBvcnQgY29uc3QgQ29sb3JEZXRhaWxzV2lkZ2V0ID0gcmVwbGFjZUNvbnRlbnRBdFNlbGVjdG9yKFNlbGVjdG9ycy5jb2xvckRldGFpbHNXaWRnZXQsIGNvbG9yRGV0YWlsc0VsZW1lbnQpO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3dpZGdldHMvY29sb3ItZGV0YWlscy53aWRnZXQudHMiLCJleHBvcnQgKiBmcm9tICcuL2NvbG91ci1sb3ZlcnMuYXBpJztcbmV4cG9ydCAqIGZyb20gJy4vdGhlLWNvbG9yLWFwaS5hcGknO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBpL2luZGV4LnRzIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgSFNWLCBSR0IgfSBmcm9tICcuLy4uL3NoYXJlZCc7XG5pbXBvcnQgeyBKU09OUCB9IGZyb20gJy4vanNvbnAnO1xuZXhwb3J0IGludGVyZmFjZSBDb2xvdXJMb3ZlcnNDb2xvciB7XG4gIGlkOiBzdHJpbmc7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIHVzZXJOYW1lOiBzdHJpbmc7XG4gIG51bVZpZXdzOiBudW1iZXI7XG4gIG51bVZvdGVzOiBudW1iZXI7XG4gIG51bUNvbW1lbnRzOiBudW1iZXI7XG4gIG51bUhlYXJ0czogbnVtYmVyO1xuICByYW5rOiBudW1iZXI7XG4gIGRhdGVDcmVhdGVkOiBEYXRlO1xuICBoZXg6IHN0cmluZztcbiAgcmdiOiBSR0I7XG4gIGhzdjogSFNWO1xuICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICB1cmw6IHN0cmluZztcbiAgaW1hZ2VVcmw6IHN0cmluZztcbiAgYmFkZ2VVcmw6IHN0cmluZztcbiAgYXBpVXJsOiBzdHJpbmc7XG59XG5leHBvcnQgY29uc3QgQ29sb3VyTG92ZXJzID0ge1xuICBnZXRDb2xvcjogKGhleDogc3RyaW5nKTogT2JzZXJ2YWJsZTxDb2xvdXJMb3ZlcnNDb2xvcltdPiA9PiB7XG4gICAgY29uc3QgdXJsID0gYGh0dHBzOi8vd3d3LmNvbG91cmxvdmVycy5jb20vYXBpL2NvbG9yLyR7aGV4fWA7XG4gICAgcmV0dXJuIEpTT05QKHVybCk7XG4gIH1cbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBpL2NvbG91ci1sb3ZlcnMuYXBpLnRzIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgSFNWLCBIU0wsIFJHQiwgQ01ZSywgWFlaIH0gZnJvbSAnLi8uLi9zaGFyZWQnO1xuaW1wb3J0IHsgSlNPTlAgfSBmcm9tICcuL2pzb25wJztcbmV4cG9ydCB0eXBlIENvbG9yQXBpQ29sb3I8VD5cbiAgPSBUICYge1xuICBmcmFjdGlvbjogVDtcbiAgdmFsdWU6IHN0cmluZztcbn07XG5leHBvcnQgZW51bSBDb2xvclNjaGVtZU1vZGUge1xuICBNb25vY2hyb21lID0gJ21vbm9jaHJvbWUnLFxuICBNb25vY2hyb21lRGFyayA9ICdtb25vY2hyb21lLWRhcmsnLFxuICBNb25vY2hyb21lTGlnaHQgPSAnbW9ub2Nocm9tZS1saWdodCcsXG4gIEFuYWxvZ2ljID0gJ2FuYWxvZ2ljJyxcbiAgQ29tcGxlbWVudCA9ICdjb21wbGVtZW50JyxcbiAgQW5hbG9naWNDb21wbGVtZW50ID0gJ2FuYWxvZ2ljLWNvbXBsZW1lbnQnLFxuICBUcmlhZCA9ICd0cmlhZCcsXG4gIFF1YWQgPSAncXVhZCdcbn1cbmV4cG9ydCBpbnRlcmZhY2UgQ29sb3JJbWFnZSB7XG4gIGJhcmU6IHN0cmluZztcbiAgbmFtZWQ6IHN0cmluZztcbn1cbmV4cG9ydCBpbnRlcmZhY2UgQ29sb3Ige1xuICBjbXlrOiBDb2xvckFwaUNvbG9yPENNWUs+O1xuICBoc2w6IENvbG9yQXBpQ29sb3I8SFNMPjtcbiAgaHN2OiBDb2xvckFwaUNvbG9yPEhTVj47XG4gIHJnYjogQ29sb3JBcGlDb2xvcjxSR0I+O1xuICBYWVo6IENvbG9yQXBpQ29sb3I8WFlaPjtcbiAgaGV4OiB7XG4gICAgdmFsdWU6IHN0cmluZztcbiAgICBjbGVhbjogc3RyaW5nO1xuICB9XG4gIG5hbWU6IHtcbiAgICB2YWx1ZTogc3RyaW5nO1xuICAgIGNsb3Nlc3RfbmFtZWRfaGV4OiBzdHJpbmc7XG4gICAgZXhhY3RfbWF0Y2hfbmFtZTogYm9vbGVhbjtcbiAgICBkaXN0YW5jZTogbnVtYmVyO1xuICB9XG4gIGltYWdlOiBDb2xvckltYWdlO1xuICBjb250cmFzdDoge1xuICAgIHZhbHVlOiBzdHJpbmc7XG4gIH1cbn1cbmV4cG9ydCBpbnRlcmZhY2UgQ29sb3JTY2hlbWUge1xuICBtb2RlOiBDb2xvclNjaGVtZTtcbiAgY291bnQ6IG51bWJlcjtcbiAgY29sb3JzOiBDb2xvcltdO1xuICBzZWVkOiBDb2xvcjtcbiAgaW1hZ2U6IENvbG9ySW1hZ2U7XG59XG5leHBvcnQgY29uc3QgVGhlQ29sb3JBcGkgPSB7XG4gIGdldENvbG9yOiAoaGV4OiBzdHJpbmcpOiBPYnNlcnZhYmxlPENvbG9yPiA9PiB7XG4gICAgY29uc3QgdXJsID0gYGh0dHA6Ly93d3cudGhlY29sb3JhcGkuY29tL2lkYDtcbiAgICByZXR1cm4gSlNPTlAodXJsLCAnY2FsbGJhY2snLCB7XG4gICAgICBmb3JtYXQ6ICdqc29uJyxcbiAgICAgIGhleDogaGV4LnJlcGxhY2UoJyMnLCAnJylcbiAgICB9KTtcbiAgfSxcbiAgZ2V0Q29sb3JTY2hlbWU6IChoZXg6IHN0cmluZywgY291bnQgPSA1LCBzY2hlbWUgPSBDb2xvclNjaGVtZU1vZGUuTW9ub2Nocm9tZSk6IE9ic2VydmFibGU8Q29sb3JTY2hlbWU+ID0+IHtcbiAgICBjb25zdCB1cmwgPSBgaHR0cDovL3d3dy50aGVjb2xvcmFwaS5jb20vc2NoZW1lYDtcbiAgICByZXR1cm4gSlNPTlAodXJsLCAnY2FsbGJhY2snLCB7XG4gICAgICBmb3JtYXQ6ICdqc29uJyxcbiAgICAgIGhleDogaGV4LnJlcGxhY2UoJyMnLCAnJyksXG4gICAgICBtb2RlOiBzY2hlbWUsXG4gICAgICBjb3VudFxuICAgIH0pO1xuICB9XG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwaS90aGUtY29sb3ItYXBpLmFwaS50cyIsImltcG9ydCAnLi9jb2xvcic7XG5pbXBvcnQgJy4vY29uc3RhbnRzJztcbmltcG9ydCAnLi9oZWxwZXJzJztcbmV4cG9ydCAqIGZyb20gJy4vY29sb3InO1xuZXhwb3J0ICogZnJvbSAnLi9jb25zdGFudHMnO1xuZXhwb3J0ICogZnJvbSAnLi9oZWxwZXJzJztcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zaGFyZWQvaW5kZXgudHMiLCJpbXBvcnQgeyBPYnNlcnZlciB9IGZyb20gJ3J4anMvT2JzZXJ2ZXInO1xuXG5jb25zdCBuZXh0Q3NzID0gYGNvbG9yOiAjZmZmOyBiYWNrZ3JvdW5kLWNvbG9yOiAjMjE5NkYzO2A7XG5jb25zdCBjb21wbGV0ZUNzcyA9IGBjb2xvcjogIzMzMzsgYmFja2dyb3VuZC1jb2xvcjogI0FFRUEwMDsgZm9udC13ZWlnaHQ6IGJvbGQ7YDtcbmNvbnN0IGVycm9yQ3NzID0gYGJhY2tncm91bmQtY29sb3I6ICNlZTAwMDA7IGNvbG9yOiAjZmZmZmZmOyBmb250LXdlaWdodDogYm9sZDtgO1xuXG5cbmV4cG9ydCBjb25zdCBvYnNlcnZlSW5Db25zb2xlXG4gID0gKHRhZzogc3RyaW5nKTogT2JzZXJ2ZXI8YW55PiA9PlxuICAoe1xuICAgIG5leHQodmFsdWU6IGFueSkge1xuICAgICAgY29uc29sZS5sb2coYCVjJHt0YWd9IG5leHQ6IGAsIG5leHRDc3MsIHZhbHVlKTtcbiAgICB9LFxuICAgIGVycm9yKGVycjogYW55KSB7XG4gICAgICBjb25zb2xlLmxvZyhgJWMke3RhZ30gZXJyb3I6IGAsIGVycm9yQ3NzLCBlcnIpO1xuICAgIH0sXG4gICAgY29tcGxldGUoKSB7XG4gICAgICBjb25zb2xlLmxvZyhgJWMke3RhZ30gY29tcGxldGVkYCwgY29tcGxldGVDc3MpO1xuICAgIH1cbiAgfSk7XG5cbmV4cG9ydCBjb25zdCBodG1sRnJvbVN0cmluZzogKGlubmVySFRNTDogc3RyaW5nKSA9PiBIVE1MRWxlbWVudCA9XG4gIGlubmVySFRNTCA9PiB7XG4gICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGlubmVySFRNTDtcbiAgICBpZih0ZW1wbGF0ZS5jb250ZW50LmNoaWxkcmVuLmxlbmd0aCAhPT0gMSkge1xuICAgICAgY29uc29sZS5lcnJvcignQSB0ZW1wbGF0ZSBkaWQgbm90IHByb2R1Y2UgYSB2YWxpZCBIVE1MIEVsZW1lbnQhJywgaW5uZXJIVE1MKTtcbiAgICB9XG4gICAgLyogRXh0cmFjdCB0aGUgZmlyc3QgY2hpbGQgZnJvbSB0aGUgPHRlbXBsYXRlPiAqL1xuICAgIGNvbnN0IGVsZW1lbnQgPSBBcnJheS5mcm9tKHRlbXBsYXRlLmNvbnRlbnQuY2hpbGRyZW4pWzBdO1xuICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gZWxlbWVudC5pbm5lckhUTUwudHJpbSgpO1xuICAgIHJldHVybiBlbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuICB9O1xuXG5leHBvcnQgY29uc3Qgd3JpdGVUb1NlbGVjdG9yID1cbiAgPFQ+KHNlbGVjdG9yOiBzdHJpbmcsIGNvbnRlbnQ6IFQpOiBUID0+IHtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbiAgICBpZihzZWxlY3Rpb24ubGVuZ3RoIDwgMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZG4ndCBmaW5kIGFueSBlbGVtZW50cyB1c2luZyB0aGUgc2VsZWN0b3IgXCIke3NlbGVjdG9yfVwiYCk7XG4gICAgfVxuXG4gICAgQXJyYXkuZnJvbShzZWxlY3Rpb24pXG4gICAgICAuZm9yRWFjaChlbGVtID0+XG4gICAgICAgIE9iamVjdC5hc3NpZ24oZWxlbSwgeyBpbm5lckhUTUw6IGNvbnRlbnQgfSlcbiAgICAgICk7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH07XG5cbmV4cG9ydCBjb25zdCByZXBsYWNlQ29udGVudEF0U2VsZWN0b3IgPVxuICA8VCBleHRlbmRzIEhUTUxFbGVtZW50PihzZWxlY3Rvcjogc3RyaW5nLCBjb250ZW50OiBUKTogVCA9PiB7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gICAgaWYoc2VsZWN0aW9uLmxlbmd0aCA8IDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGRuJ3QgZmluZCBhbnkgZWxlbWVudHMgdXNpbmcgdGhlIHNlbGVjdG9yIFwiJHtzZWxlY3Rvcn1cImApO1xuICAgIH1cblxuICAgIEFycmF5LmZyb20oc2VsZWN0aW9uKVxuICAgICAgLmZvckVhY2goZWxlbSA9PiB7XG4gICAgICAgIEFycmF5LmZyb20oZWxlbS5jaGlsZHJlbikuZm9yRWFjaCgoY2hpbGQ6IEhUTUxFbGVtZW50KSA9PiBjaGlsZC5yZW1vdmUoKSk7XG4gICAgICAgIGVsZW0uYXBwZW5kQ2hpbGQoY29udGVudCk7XG4gICAgICB9KTtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfTtcblxuXG5leHBvcnQgY29uc3QgQWNjdW11bGF0b3JzOiBSZWNvcmQ8J0NpcmN1bGFyJyB8ICdDbGFtcGVkJywgKGFjYzogbnVtYmVyLCB2YWx1ZTogbnVtYmVyLCBpOiBudW1iZXIpID0+IG51bWJlcj4gPVxuICB7XG4gICAgQ2lyY3VsYXIodmFsdWUsIGNoYW5nZSkge1xuICAgICAgY29uc3QgbmV4dFZhbHVlID0gdmFsdWUgKyBjaGFuZ2U7XG4gICAgICByZXR1cm4gY2hhbmdlIDwgMFxuICAgICAgICA/IChuZXh0VmFsdWUgPCAwID8gKG5leHRWYWx1ZSArIDEpIDogbmV4dFZhbHVlKVxuICAgICAgICA6IChuZXh0VmFsdWUgPj0gMSA/IChuZXh0VmFsdWUgLSAxKSA6IG5leHRWYWx1ZSk7XG4gICAgfSxcbiAgICBDbGFtcGVkKHZhbHVlLCBjaGFuZ2UpIHtcbiAgICAgIGNvbnN0IG5leHRWYWx1ZSA9IHZhbHVlICsgY2hhbmdlO1xuICAgICAgcmV0dXJuIGNoYW5nZSA8IDBcbiAgICAgICAgPyAobmV4dFZhbHVlIDwgMCA/IDAgOiBuZXh0VmFsdWUpXG4gICAgICAgIDogKG5leHRWYWx1ZSA+PSAxID8gMSA6IG5leHRWYWx1ZSk7XG4gICAgfVxuICB9O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NoYXJlZC9oZWxwZXJzLnRzIl0sInNvdXJjZVJvb3QiOiIifQ==