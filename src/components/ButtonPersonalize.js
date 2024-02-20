import { View, Text, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons"

export default function ButtonPersonalize({ size, color, focused }) {
    return (
        <View style={[style.container, {backgroundColor: focused ? color : '#7a8eff'}]}>
            <AntDesign name='dashboard' size={size} color={focused ? '#fff' : '#f8f8f8'} />
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#3eccf5',
        alignItems: "center",
        justifyContent: 'center',
        marginBottom: 20
    }
})