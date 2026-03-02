import React from 'react';
import { ScrollView, View, StyleSheet, StatusBar } from 'react-native';
import { colors } from '../theme';

type Props = {
  children: React.ReactNode;
  scrollable?: boolean;
};

export default function ScreenContainer({ children, scrollable = true }: Props) {
  if (scrollable) {
    return (
      <View style={styles.wrapper}>
        <StatusBar barStyle="light-content" />
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, styles.container, styles.nonScrollContent]}>
      <StatusBar barStyle="light-content" />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  nonScrollContent: {
    padding: 20,
  },
});
