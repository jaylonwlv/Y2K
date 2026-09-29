import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { Geist } from '@/components/widgets/tokens';

export function FormField({ label, hint, ...input }: TextInputProps & { label: string; hint?: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor="#C49BB8" style={styles.input} {...input} />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 6 },
  label: { fontFamily: Geist.bold, fontSize: 14, color: '#3B0E33' },
  input: {
    fontFamily: Geist.medium,
    fontSize: 17,
    color: '#3B0E33',
    backgroundColor: 'white',
    borderRadius: 14,
    borderCurve: 'continuous',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#F3D3EA',
  },
  hint: { fontFamily: Geist.medium, fontSize: 13, color: '#9E6A93' },
});
