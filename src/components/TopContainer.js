// // Importar quando for fazer o banner
// import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

import { View } from "react-native";

// const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-2622314928308994/2354703549'

const TopContainer = () => (
    <View style={{ 
            backgroundColor: '#ddd',
            height: "10%",
            width: "100%",
            paddingTop: 30 
        }}>

        {/* <BannerAd
            unitId={adUnitId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
                requestNonPersonalizedAdsOnly: true
            }}
        /> */}

    </View>
);

export default TopContainer