import React, {useEffect, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';

import {RootState, store} from './store';
import {Provider, useDispatch, useSelector} from 'react-redux';
import useRandomSequence from './src/Hooks/useRandomSequence';
import {appendElement} from './src/Features/sequenceSlice';
import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import Highscores from './src/Components/Highscores';

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={App} />
          <Stack.Screen name="Highscores" component={Highscores} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Home: undefined;
  Highscores: {
    score: number;
    restartGame: () => void;
  };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const App = ({navigation}: Props) => {
  const [clickedColor, setClickedColor] = useState<number>();
  const dispatch = useDispatch();
  const nameModalVisible = useSelector(
    (state: RootState) => state.nameModal.showModal,
  );
  const currentColor = useSelector(
    (state: RootState) => state.simonSequence.currentColor,
  );
  const {isActive, score, restartGame, simonSpeaks} = useRandomSequence();

  const handleClick = (number: number) => {
    !simonSpeaks && isActive && dispatch(appendElement(number));
  };

  const handlePressIn = (colorId: number) => {
    !simonSpeaks && isActive && setClickedColor(colorId);
  };

  useEffect(() => {
    nameModalVisible &&
      navigation.navigate(
        'Highscores' as never,
        {
          score: score,
          restartGame: restartGame,
        } as never,
      );
  }, [nameModalVisible]);

  const ColorBox = (
    colorId: number,
    colorStringIn: string,
    colorStringOut: string,
  ) => {
    return (
      <Pressable
        onPress={() => handleClick(colorId)}
        onPressIn={() => handlePressIn(colorId)}
        onPressOut={() => setClickedColor(-1)}
        style={{
          flex: 1,
          backgroundColor:
            currentColor === colorId || clickedColor === colorId
              ? colorStringIn
              : colorStringOut,
        }}></Pressable>
    );
  };

  return (
    <SafeAreaView>
      <StatusBar />
      <View
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          flexDirection: 'column',
          height: '100%',
        }}>
        <View style={styles.colorContainer}>
          <View style={styles.circle}>
            {!isActive ? (
              <Pressable onPress={restartGame} style={styles.startContainer}>
                <Text style={styles.startText}>Start</Text>
              </Pressable>
            ) : (
              <Text style={styles.score}>{score}</Text>
            )}
          </View>
          <View style={styles.colorRow}>
            {ColorBox(1, 'rgb(0,225,0)', 'rgb(0,50,0)')}
            {ColorBox(2, 'rgb(225,0,0)', 'rgb(50,0,0)')}
          </View>
          <View style={styles.colorRow}>
            {ColorBox(3, 'rgb(225,225,0)', 'rgb(50,50,0)')}
            {ColorBox(4, 'rgb(0,0,225)', 'rgb(0,0,50)')}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  score: {
    fontSize: 48,
    textAlign: 'center',
    margin: '10%',
    color: 'white',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  startText: {
    color: 'white',
    fontSize: 48,
  },
  circle: {
    height: 200,
    borderRadius: 100,
    width: 200,
    position: 'absolute',
    top: '50%',
    transform: [{translateY: -50}],
    zIndex: 1,
    left: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(0,0,0)',
  },
  startContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  colorContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  colorRow: {
    display: 'flex',
    flexDirection: 'row',

    height: '50%',
  },
});

export default AppWrapper;
