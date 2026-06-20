/**
 * Hypertrofit — fitness app shell.
 * Simple state-based navigation (no react-navigation) per the prototype.
 * @format
 */
import React, {useState} from 'react';
import {StatusBar, View, Text, Pressable, StyleSheet} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import {Palette, DARK, LIGHT, R} from './src/theme';
import {ThemeProvider, useTheme} from './src/ThemeContext';
import {Brand} from './src/components/Brand';
import {Icon} from './src/components/Icon';
import {DevRoleSwitcher} from './src/components/DevRoleSwitcher';
import {TabBar, TabKey} from './src/components/TabBar';
import {RoleProvider, useRole} from './src/RoleContext';
import {WorkoutProvider, useWorkouts} from './src/WorkoutContext';
import {ROLE_META} from './src/roles';
import {Routine, ROUTINES, todaysRoutine} from './src/routines';
import {Today} from './src/screens/Today';
import {Plan} from './src/screens/Plan';
import {Train} from './src/screens/Train';
import {Session} from './src/screens/Session';
import {Stats} from './src/screens/Stats';
import {You} from './src/screens/You';

function Shell() {
  const [tab, setTab] = useState<TabKey>('today');
  // Session runs as a full-screen modal over the tab shell.
  const [sessionRoutine, setSessionRoutine] = useState<Routine | null>(null);
  const {role} = useRole();
  const {addSession} = useWorkouts();
  const {scheme, t, toggle} = useTheme();
  const styles = SS[scheme];
  const roleMeta = ROLE_META[role];

  // Sin rutina explícita, arranca la de hoy (o la primera del split).
  const openSession = (routine?: Routine) =>
    setSessionRoutine(routine ?? todaysRoutine() ?? ROUTINES[0]);
  const closeSession = () => setSessionRoutine(null);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar
        barStyle={scheme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={t.bg}
      />
      {sessionRoutine ? (
        <Session
          routine={sessionRoutine}
          onClose={closeSession}
          onComplete={s => {
            addSession(s);
            closeSession();
          }}
        />
      ) : (
        <>
          <View style={styles.brandBar}>
            <Brand size={16} />
            <View style={styles.brandRight}>
              {/* Alternar tema claro / oscuro */}
              <Pressable
                onPress={toggle}
                hitSlop={8}
                style={({pressed}) => [styles.themeBtn, {opacity: pressed ? 0.6 : 1}]}>
                {scheme === 'light'
                  ? Icon.moon({color: t.fg2, size: 18})
                  : Icon.sun({color: t.fg2, size: 18})}
              </Pressable>
              <View style={[styles.roleChip, {borderColor: t[roleMeta.color]}]}>
                <View style={[styles.roleDot, {backgroundColor: t[roleMeta.color]}]} />
                <Text style={styles.roleChipText} allowFontScaling={false}>
                  {roleMeta.label}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.body}>
            {tab === 'today' && <Today onStart={openSession} />}
            {tab === 'plan' && <Plan onStart={openSession} />}
            {tab === 'session' && <Train onStart={openSession} />}
            {tab === 'stats' && <Stats />}
            {tab === 'you' && <You />}
          </View>
          <TabBar active={tab} onChange={setTab} />
          {/* DEV ONLY — switcher temporal de tipo de usuario */}
          <DevRoleSwitcher />
        </>
      )}
    </SafeAreaView>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RoleProvider>
          <WorkoutProvider>
            <Shell />
          </WorkoutProvider>
        </RoleProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const makeStyles = (t: Palette) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: t.bg,
    },
    brandBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: t.line,
    },
    brandRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    themeBtn: {
      padding: 2,
    },
    roleChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      borderWidth: 1,
      borderRadius: R.r1,
      paddingVertical: 5,
      paddingHorizontal: 9,
    },
    roleDot: {
      width: 6,
      height: 6,
      borderRadius: R.full,
    },
    roleChipText: {
      color: t.fg1,
      fontSize: 9,
      fontWeight: '700',
      letterSpacing: 1.6,
    },
    body: {
      flex: 1,
    },
  });

const SS = {dark: makeStyles(DARK), light: makeStyles(LIGHT)};

export default App;
