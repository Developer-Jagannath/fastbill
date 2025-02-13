import React from 'react';
import {View, TextInput, StyleSheet, TextInputProps} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface SearchBoxProps extends TextInputProps {
  placeholder?: string;
  onSearch?: (text: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = 'Search...',
  onSearch,
  ...props
}) => {
  const handleTextChange = (text: string) => {
    if (onSearch) {
      onSearch(text);
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons
        name="search-outline"
        size={20}
        color="#888"
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        onChangeText={handleTextChange}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});

export default SearchBox;