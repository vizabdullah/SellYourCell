import { View, Text, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState } from 'react'
import Swiper from 'react-native-swiper';
import { useFocusEffect } from '@react-navigation/native';
const {height,width} =Dimensions.get('window')


const HomeScreen = () => 
{
    
    const [data, setData] = useState([
        { id: 1, image: require('./../../assets/images/cricket1.jpg'), text: 'A Cricket ground in Adelaide, Australia' },
        { id: 2, image: require('./../../assets/images/football1.jpg'), text: 'Football and player shoes' },
        { id: 3, image: require('./../../assets/images/cricket2.jpg'), text: 'A batsman hitting the cricket ball' },
        { id: 4, image: require('./../../assets/images/football2.jpg'), text: 'The complete field of football ground' },
        { id: 5, image: require('./../../assets/images/cricket3.jpg'),text: 'An ongoing test match of cricket' },
        { id: 6, image: require('./../../assets/images/football3.jpg'), text: 'A player hitting the football for penalty kick' },
        { id: 7, image: require('./../../assets/images/cricket4.jpg'), text: 'People playing cricket at Sea Side' },
        { id: 8, image: require('./../../assets/images/football4.jpg'), text: 'A match of European football league' },
      ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <View style={{flex: 1, }}>
      <View
        style={{
          height: height / 2 + 100,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
      
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          contentContainerStyle={{ alignItems: 'center' }}
          onScroll={e => {
            const x = e.nativeEvent.contentOffset.x;
            setCurrentIndex((x / width).toFixed(0));
          }}
          horizontal
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  width: width - 50,
                  height: height / 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 30,
                  marginRight: 20
                }}>
                <Image 
                    source={item.image} 
                    style={{
                         width: '90%', 
                         height: '90%', 
                         backgroundColor: 'black', 
                         borderRadius: 10 
                        }} 

                />
                <Text style={{ color: 'black',fontSize: 15,fontWeight: 'bold', marginTop: 20 }}>{item.text}</Text>

              </View>
            );
          }}
          
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: width,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {data.map((item, index) => {
          return (
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 20,
                backgroundColor: currentIndex == index ? 'black' : 'gray',
                marginLeft: 5,
                marginTop: 30
              }}></View>
          );
        })}
      </View>
    </View>
  );
}

export default HomeScreen