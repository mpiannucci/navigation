import React from 'react';
import { StyleSheet, Text, Image, View, TouchableHighlight } from 'react-native';
import Tweets from './Tweets';

export default ({tweets, stateNavigator}) => (
  <View style={styles.view}>
    <View style={styles.banner}>
      <Text style={styles.title}>Home</Text>
    </View>
    <View style={styles.view}>
      <Tweets tweets={tweets} stateNavigator={stateNavigator} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  banner: {
    paddingTop: 40,
    paddingLeft: 60,
    paddingBottom: 20,
    marginBottom: 10,
    borderBottomWidth: 2,
    borderColor: '#ccd6dd',
  },
  title: {
    fontWeight: 'bold',
  },
  view: {
    paddingLeft: 10,
    paddingRight: 10,
  },
});
