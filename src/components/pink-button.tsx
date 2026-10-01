import { Pressable, StyleSheet, Text } from 'react-native';

import { Geist } from '@/components/widgets/tokens';
import { gradient } from '@/lib/gradient';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  /** Full width and taller, for the one main action on a screen. */
  wide?: boolean;
};

export function PinkButton({ label, onPress, disabled, variant = 'primary', wide }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' ? styles.primary : styles.secondary,
        wide && styles.wide,
        (pressed || disabled) && { opacity: 0.7 },
      ]}>
      <Text style={[styles.label, variant === 'secondary' && styles.secondaryLabel, wide && styles.wideLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignSelf: 'flex-start', paddingHorizontal: 18, paddingVertical: 11, borderRadius: 999 },
  primary: gradient('linear-gradient(180deg, #FF8ACB 0%, #E3268F 100%)'),
  secondary: { backgroundColor: '#FCE1F3' },
  wide: { alignSelf: 'stretch', alignItems: 'center', paddingVertical: 16 },
  wideLabel: { fontSize: 17 },
  label: { color: 'white', fontFamily: Geist.bold, fontSize: 15 },
  secondaryLabel: { color: '#C21F7E' },
});
