import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PixelRatio,
  Keyboard,
  Platform,
  Animated,
  LayoutChangeEvent,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/AntDesign';
import GlobalStyle from '@styles/global';

type State = {
  layout: {height: number, width: number},
  keyboard: boolean,
  visible: Animated.Value,
};

class MainTabBar extends React.Component {
  state = {
    layout: {height: 0, width: 0},
    keyboard: false,
    visible: new Animated.Value(1),
  };

  componentDidMount() {
    if (Platform.OS === 'ios') {
      Keyboard.addListener('keyboardWillShow', this._handleKeyboardShow);
      Keyboard.addListener('keyboardWillHide', this._handleKeyboardHide);
    } else {
      Keyboard.addListener('keyboardDidShow', this._handleKeyboardShow);
      Keyboard.addListener('keyboardDidHide', this._handleKeyboardHide);
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'ios') {
      Keyboard.removeListener('keyboardWillShow', this._handleKeyboardShow);
      Keyboard.removeListener('keyboardWillHide', this._handleKeyboardHide);
    } else {
      Keyboard.removeListener('keyboardDidShow', this._handleKeyboardShow);
      Keyboard.removeListener('keyboardDidHide', this._handleKeyboardHide);
    }
  }

  _handleKeyboardShow = () =>
    this.setState({keyboard: true}, () =>
      Animated.timing(this.state.visible, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(),
    );

  _handleKeyboardHide = () =>
    Animated.timing(this.state.visible, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      this.setState({keyboard: false});
    });

  _handleLayout = (e: LayoutChangeEvent) => {
    const {layout} = this.state;
    const {height, width} = e.nativeEvent.layout;

    if (height === layout.height && width === layout.width) {
      return;
    }

    this.setState({
      layout: {
        height,
        width,
      },
    });
  };

  render() {
    const {state} = this.props.navigation;
    const activeTabIndex = state.index;
    return (
      <Animated.View
        style={[
        {
          // When the keyboard is shown, slide down the tab bar
          transform: [
            {
              translateY: this.state.visible.interpolate({
                inputRange: [0, 1],
                outputRange: [this.state.layout.height, 0],
              }),
            },
          ],
          // Absolutely position the tab bar so that the content is below it
          // This is needed to avoid gap at bottom when the tab bar is hidden
            position: this.state.keyboard ? 'absolute' : null,
          },
          styles.tabBar,
        ]}
        pointerEvents={this.state.keyboard ? 'none' : 'auto'}
        onLayout={this._handleLayout}>

        <View style={styles.tabBarContainer}>
          {state.routes.map((element, index) => {
            let focused = activeTabIndex == index;
            let iconStyle = focused
              ? GlobalStyle.iconTabBarSelected
              : GlobalStyle.iconTabBar;
            let textStyle = focused
              ? GlobalStyle.textTabBarSelected
              : GlobalStyle.textTabBar;
            return (
              <TouchableOpacity
                key={element.key}
                onPress={() => Actions[element.key]()}
                style={styles.tabBarButton}>
                <Icon
                  style={iconStyle}
                  name={element.routes[0].params.iconName || 'circle'}
                  size={35}
                />
                <Text style={textStyle}>{element.routes[0].params.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  tabBar: {
    flex: 1,
    position: 'absolute',
    bottom: 10,
    width: '90%',
    flexDirection: 'column',
    borderRadius: 30,
    shadowOffset:{  width: 50,  height: 50,  },
    shadowColor: 'red',
    shadowRadius: 30,
    shadowOpacity: 0.8,
    elevation: 2,
    alignSelf: 'center',
  },
  tabBarContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopColor: 'darkgrey',
    borderRadius: 30,
  },
  tabBarButton: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 5,
  },
});

export default MainTabBar;
