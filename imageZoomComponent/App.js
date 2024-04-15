import 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import React from 'react';
import PinchableBox from './src/components/PinchableBox';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#FFFFFF" translucent={true} />
      <PinchableBox />
    </>

  )
}

export default App;