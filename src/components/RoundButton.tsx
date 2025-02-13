import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

interface RoundButtonProps {
  onPress: () => void; // Function to handle button press
  iconName?: string; // Icon name (optional)
  backgroundColor?: string; // Button background color (optional)
  iconColor?: string; // Icon color (optional)
  size?: number; // Button size (optional, affects width, height, and icon size)
}

const RoundButton: React.FC<RoundButtonProps> = ({
  onPress,
  iconName = 'add', // Default icon
  backgroundColor = '#60a5fa', // Default background color (blue)
  iconColor = 'white', // Default icon color
  size = 50, // Default size
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor, width: size, height: size, borderRadius: size / 2 },
      ]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Icon name={iconName} size={size * 0.5} color={iconColor} />
    </TouchableOpacity>
  );
};

export default RoundButton;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});