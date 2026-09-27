import { ExtensionStorage } from '@bacons/apple-targets';
import { Platform } from 'react-native';

import appConfig from '../../app.json';

/** Must match the App Group in app.json; the widget derives the same id from its bundle id. */
export const APP_GROUP = appConfig.expo.ios.entitlements['com.apple.security.application-groups'][0];

/** Widget `kind` strings from targets/widget/*.swift. */
export const WidgetKind = { calendar: 'Y2KCalendar' } as const;

const storage = Platform.OS === 'ios' ? new ExtensionStorage(APP_GROUP) : null;

export function setCalendarShowsEvents(show: boolean) {
  storage?.set('calendar.showEvents', show ? 1 : 0);
  reloadWidgets(WidgetKind.calendar);
}

export function getCalendarShowsEvents() {
  return storage?.get('calendar.showEvents') !== '0';
}

export function reloadWidgets(kind?: string) {
  if (Platform.OS === 'ios') ExtensionStorage.reloadWidget(kind);
}
