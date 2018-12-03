import { Observable } from 'rxjs';
import { Selectors, replaceContentAtSelector, htmlFromString, observeInConsole, writeToSelector } from '../shared';
import { ColourLovers } from '../api';
import { hexString$ } from '../features';
const widgetSelectors = {
  colorName: '.color-name'
};
const hex$ = hexString$.debounceTime(2000).share();
// const colorDetails$ = hex$.switchMap(ColourLovers.getColor);
const colorName$
  = hex$
  .switchMap(hex =>
    Observable.concat(
      Observable.of('Getting color details'),
      ColourLovers.getColor(hex)
        .map(colors =>
          colors.length > 0
            ? colors[0].title
            : 'Color not found'
        )
    )
  );
colorName$
  .do(iconText => writeToSelector(widgetSelectors.colorName, iconText))
  .subscribe(observeInConsole('hsv'));
const colorDetailsElement = htmlFromString(`
  <h1 class="color-name"></h1>
 `);
console.log(colorDetailsElement);
export const ColorFinderWidget = replaceContentAtSelector(Selectors.colorDetailsWidget, colorDetailsElement);