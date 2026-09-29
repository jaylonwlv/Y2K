import { Pressable, StyleSheet, Text } from 'react-native';

import { Geist } from '@/components/widgets/tokens';

type Props = { label: string; onPress: () => void; disabled?: boolean; variant?: 'primary' | 'secondary' };

export function PinkButton({ label, onPress, disabled, variant = 'primary' }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' ? styles.primary : styles.secondary,
        (pressed || disabled) && { opacity: 0.7 },
      ]}>
      <Text style={[styles.label, variant === 'secondary' && styles.secondaryLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignSelf: 'flex-start', paddingHorizontal: 18, paddingVertical: 11, borderRadius: 999 },
  primary: { experimental_backgroundImage: 'linear-gradient(180deg, #FF8ACB 0%, #E3268F 100%)' },
  secondary: { backgroundColor: '#FCE1F3' },
  label: { color: 'white', fontFamily: Geist.bold, fontSize: 15 },
  secondaryLabel: { color: '#C21F7E' },
});
