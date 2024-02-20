import React from 'react';
import { Text, StyleSheet } from 'react-native';

const CustomText = ({ children, style }) => {
    return <Text style={[styles.text, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
    text: {
        fontSize: 30,
        justifyContent: 'center',
        alignItems: 'baseline',
        textAlign: "center",
        padding: 5,
        marginTop: 10
    },
});

export default CustomText;
