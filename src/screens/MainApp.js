import React, { useEffect, useRef, useState } from 'react'
import {StyleSheet,Dimensions, Platform, View, BackHandler } from 'react-native'
import * as Progress from 'react-native-progress';
import WebView from 'react-native-webview';

const MainApp = () => {
    const webView = useRef(null);
    const canGoBack = useRef(false);
    const [indeterminate, setIndeterminate] = useState(true);
    const [progress, setProgress] = useState(0);
    const [isLoading, setLoading] = useState(true);
    const INJECTEDJAVASCRIPT =
    "const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=0.99, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); ";


    useEffect(() => {
        if (Platform.OS === 'android') {
          BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
        }
        return () => {
          if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress');
          }
        };
      }, []);

    const onAndroidBackPress = () => {
        webView.current.goBack();
        if (!canGoBack.current) {
          showAlert(
            Strings.ALERTS.EXIT_APP.TITLE,
            Strings.ALERTS.EXIT_APP.MESSAGE,
            BackHandler.exitApp,
          );
        }
        return true;
      };
    


    const animate = () => {
        let progress = 0;
        setProgress(progress);
        setTimeout(() => {
          setIndeterminate(false);
          setInterval(() => {
            progress += Math.random() / 5;
            if (progress > 1) {
              progress = 1;
            }
            setProgress(progress);
          }, 500);
        }, 1500);
      };
    return (
        <View style={styles.container}>
        <WebView
          source={{uri: 'https://drnoscoaching.com/'}}
          ref={webView}
          onLoad={() => setLoading(false)}
          onLoadStart={() => setLoading(true)}
          onLoadProgress={({nativeEvent}) => {
            setProgress(nativeEvent.progress);
            if (nativeEvent.progress != 1 && isLoading == false) {
              setLoading(true);
            } else if (nativeEvent.progress == 1) {
              setLoading(false);
            }
            canGoBack.current = nativeEvent.canGoBack;
          }}
          onNavigationStateChange={data => {
            //console.log({onNavigationStateChange: data});
            webView.current.canGoBack = data;
            // canGoBack.current = data.canGoBack;
          }}
          scalesPageToFit={Platform.OS === 'android' ? false : true}
          injectedJavaScript={INJECTEDJAVASCRIPT}
          scrollEnabled
          domStorageEnabled={true}
          userAgent={
            Platform.OS === 'ios' ? 'modjen iosApp' : 'modjen androidApp'
          }
        />
        {isLoading && (
          <Progress.Bar
            width={Dimensions.get('window').width}
            height={2}
            progress={progress}
            //indeterminate={indeterminate}
            style={{
              backgroundColor: 'red',
              position: 'absolute',
              top: `0%`,
            }}
          />
        )}
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

export default MainApp;