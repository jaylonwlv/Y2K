import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { addDays, type Plan } from './plans';

/**
 * A local notification a day before a free trial turns into a paid plan, so nobody gets charged
 * by surprise. Apple doesn't send one.
 */
const ID = 'trial-reminder';

if (Platform.OS === 'ios') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

/** Asks for notification permission and schedules the reminder. False if it couldn't be set. */
export async function scheduleTrialReminder(plan: Plan, trialStart = new Date()) {
  if (Platform.OS !== 'ios' || !plan.trialDays) return false;
  const billing = addDays(trialStart, plan.trialDays);
  const remindAt = addDays(billing, -1);
  if (remindAt <= new Date()) return false;

  const { granted } = await Notifications.requestPermissionsAsync();
  if (!granted) return false;

  const day = billing.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
  await cancelTrialReminder();
  await Notifications.scheduleNotificationAsync({
    identifier: ID,
    content: {
      title: 'Your free trial ends tomorrow ✧',
      body: `Y2K Home Plus starts at ${plan.price}/${plan.period} on ${day}. Not for you? Cancel anytime in Settings.`,
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: remindAt },
  });
  return true;
}

export async function cancelTrialReminder() {
  if (Platform.OS !== 'ios') return;
  try {
    await Notifications.cancelScheduledNotificationAsync(ID);
  } catch {
    // Nothing scheduled.
  }
}
