import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home from './pages/Home'
import CalcLitro from './pages/CalcLitro'
import Posto from './pages/posto';

import { Entypo, AntDesign } from "@expo/vector-icons"

import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TopContainer from './components/TopContainer';

// isso aqui é para importar o buttontab personalizado
// import ButtonPersonalize from './components/ButtonPersonalize';

const Tab = createBottomTabNavigator();

export default function Routes() {
    return (
        <View style={{ flex: 1 }}>
            <TopContainer/>
            <Tab.Navigator
                initialRouteName='Postos'
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: "#121212",
                        borderTopColor: 'transparent',
                        padding: 5
                    }
                }}
            >
                <Tab.Screen
                    name='Km/Litro'
                    component={CalcLitro}
                    options={{
                        tabBarIcon: ({ size, color }) => (
                            <AntDesign name='car' size={size} color={color} />
                        )
                    }}
                />

                <Tab.Screen
                    name='Inicio'
                    component={Home}
                    options={{
                        tabBarLabel: "Álcool / Gasolina",
                        tabBarIcon: ({ size, color }) => (
                            <AntDesign name='dashboard' size={size} color={color} />
                        )
                    }}
                />

                <Tab.Screen
                    name='Postos'
                    component={Posto}
                    options={{
                        tabBarIcon: ({ size, color }) => (
                            <Entypo name='credit' size={size} color={color} />
                        )
                    }}
                />

                {/* 
            //Botão personalizado
            <Tab.Screen
                name='Person'
                component={Home}
                options={{
                    tabBarLabel: "",
                    tabBarIcon: ({ focused, size, color }) => (
                        <ButtonPersonalize size={size} color={color} focused={focused}/>
                    )
                }}
            /> */}
            </Tab.Navigator>
            <StatusBar style="auto" backgroundColor="#fff" />
        </View>
    )
}