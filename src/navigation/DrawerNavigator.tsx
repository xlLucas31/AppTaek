import { ReactNode, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export interface DrawerScreenComponentProps {
  onOpenDrawer: () => void;
  isActive: boolean;
}

export interface DrawerScreenConfig {
  key: string;
  title: string;
  component: React.ComponentType<DrawerScreenComponentProps>;
  icon?: ReactNode;
}

interface DrawerNavigatorProps {
  screens: DrawerScreenConfig[];
  initialKey?: string;
  appTitle?: string;
}

const drawerWidth = Math.min(300, Dimensions.get('window').width * 0.8);

export const DrawerNavigator = ({
  screens,
  initialKey,
  appTitle = 'Taekwon-Do Manager',
}: DrawerNavigatorProps) => {
  const [activeKey, setActiveKey] = useState(initialKey ?? screens[0]?.key);
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const translateX = useRef(new Animated.Value(-drawerWidth)).current;

  const activeScreen = useMemo(() => {
    if (!screens.length) {
      return undefined;
    }
    return screens.find((screen) => screen.key === activeKey) ?? screens[0];
  }, [screens, activeKey]);

  const openDrawer = () => {
    setDrawerVisible(true);
    Animated.timing(translateX, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(translateX, {
      toValue: -drawerWidth,
      duration: 200,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setDrawerVisible(false);
      }
    });
  };

  const handleNavigate = (key: string) => {
    setActiveKey(key);
    closeDrawer();
  };

  if (!activeScreen) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay pantallas configuradas.</Text>
      </SafeAreaView>
    );
  }

  const ScreenComponent = activeScreen.component;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.root}>
        {isDrawerVisible && (
          <Pressable style={styles.scrim} onPress={closeDrawer} accessibilityRole="button" />
        )}
        <Animated.View
          style={[styles.drawer, { width: drawerWidth, transform: [{ translateX }] }]}
        >
          <View style={styles.drawerHeader}>
            <Text style={styles.appTitle}>{appTitle}</Text>
          </View>
          <View style={styles.drawerContent}>
            {screens.map((screen) => {
              const isActive = screen.key === activeScreen.key;
              return (
                <Pressable
                  key={screen.key}
                  style={[styles.drawerItem, isActive && styles.drawerItemActive]}
                  onPress={() => handleNavigate(screen.key)}
                  accessibilityRole="button"
                >
                  <View style={styles.drawerItemRow}>
                    {screen.icon ? <View style={styles.drawerIcon}>{screen.icon}</View> : null}
                    <Text
                      style={[styles.drawerLabel, isActive && styles.drawerLabelActive]}
                    >
                      {screen.title}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
        <View style={styles.screenContainer}>
          <ScreenComponent onOpenDrawer={openDrawer} isActive />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  emptyText: {
    fontSize: 16,
    color: '#4b5563',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#111827',
    paddingTop: 48,
    paddingBottom: 24,
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  drawerHeader: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f9fafb',
  },
  drawerContent: {
    flex: 1,
  },
  drawerItem: {
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  drawerItemActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.18)',
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
  },
  drawerItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerIcon: {
    marginRight: 12,
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#d1d5db',
  },
  drawerLabelActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  scrim: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 10,
  },
  screenContainer: {
    flex: 1,
    zIndex: 5,
  },
});

export default DrawerNavigator;
