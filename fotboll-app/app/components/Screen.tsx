import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import ErrorBoundary from '@/app/components/ErrorBoundary';
import { FC25 } from '@/app/components/Theme';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  contentContainerStyle?: any;
};

export default function Screen({ children, scroll = false, contentContainerStyle }: Props) {
  const Container = scroll ? ScrollView : View;
  return (
    <View style={[styles.root, { backgroundColor: FC25.colors.bg }]}>
      <ErrorBoundary fallback={<View style={styles.fallback} />}> 
        <Container {...(scroll ? { contentContainerStyle: [styles.cc, contentContainerStyle] } : { style: styles.cc })}>
          {children}
        </Container>
      </ErrorBoundary>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  cc: { padding: 24, gap: 16 },
  fallback: { padding: 24 },
});

