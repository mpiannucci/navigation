import React from 'react';
import { Platform, requireNativeComponent } from 'react-native';

export default Platform.OS == "android" ? requireNativeComponent('NVBottomTabBar', null) : null;