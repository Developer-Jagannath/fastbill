import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

interface CalculatorButtonProps {
  label: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  flex?: number;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  label,
  onPress,
  backgroundColor = '#f5f5f5',
  textColor = '#000',
  flex = 1,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={[styles.button, {backgroundColor, flex}]}
      onPress={onPress}>
      <Text style={[styles.text, {color: textColor}]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    height: 50,
    borderRadius: 8,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default CalculatorButton;