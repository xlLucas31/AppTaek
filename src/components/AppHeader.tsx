import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface AppHeaderProps {
  title: string;
  onMenuPress: () => void;
  actions?: ReactNode;
}

export const AppHeader = ({ title, onMenuPress, actions }: AppHeaderProps) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={onMenuPress} accessibilityRole="button" style={styles.menuButton}>
        <Text style={styles.menuIcon}>☰</Text>
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.actions}>{actions}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1f2937',
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginRight: 16,
    padding: 6,
  },
  menuIcon: {
    fontSize: 22,
    color: '#f9fafb',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#f9fafb',
  },
  actions: {
    minWidth: 20,
    alignItems: 'flex-end',
  },
});

export default AppHeader;
