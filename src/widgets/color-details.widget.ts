import { Observable } from 'rxjs';
import { observeInConsole, htmlFromString } from '../shared';
import { TheColorApi, Color } from '../api';
import { hexString$ } from '../features';

const colorDetails$: Observable<Color> =
  hexString$.debounceTime(1000)
    .switchMap(hex => TheColorApi.getColor(hex))
    .do(observeInConsole('hexString$'))
    .share();

const hexMatchesNamedColor$ = colorDetails$.map(details => details.name.exact_match_name);

export const ColorDetailsWidget: Observable<HTMLElement> =
  Observable.combineLatest(
    colorDetails$,
    hexMatchesNamedColor$
  )
    .do(observeInConsole('ColorDetailsWidget'))
    .map(([color, matches]) => `
    <div class="">
      <h1 class="header">
        <img class="ui avatar image" src="${color.image.bare}">
        <span>${color.name.value} ${!matches ? '' : '<span>(exact match!)</span>'}</span>
      </h1>
    </div>
  `)
    .map(htmlString => htmlFromString(htmlString));