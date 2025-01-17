import { VideoView, useVideoPlayer } from 'expo-video';
import React, { useEffect, useState } from 'react';
import { BackHandler, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import ChannelList from './components/ChannelList';
import SearchBar from './components/SearchBar';
import { channels } from './data/channels';
import { Channel } from './types';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const player = useVideoPlayer(selectedChannel?.url || null, player => {
    player.loop = true;
    if (selectedChannel && isFullscreen) {
      player.play();
    }
  });

  // Uygulama kapatıldığında medyayı durdur
  useEffect(() => {
    return () => {
      if (player) {
        player.pause();
      }
    };
  }, [player]);

  // Tam ekran değiştiğinde medya kontrolü
  useEffect(() => {
    if (!isFullscreen && player) {
      player.pause();
    }
  }, [isFullscreen, player]);

  // Geri tuşu kontrolü
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isFullscreen) {
        setIsFullscreen(false);
        if (player) {
          player.pause();
        }
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [isFullscreen, player]);

  const handleChannelSelect = (channel: Channel) => {
    setSelectedChannel(channel);
    setIsFullscreen(true);
    if (player) {
      player.replace(channel.url);
    }
  };

  const handleVideoPress = () => {
    setIsFullscreen(false);
    if (player) {
      player.pause();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {!isFullscreen ? (
          <View style={styles.fullscreenContainer}>
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
            <ChannelList
              channels={channels}
              onChannelSelect={handleChannelSelect}
              searchQuery={searchQuery}
            />
          </View>
        ) : (
          selectedChannel && (
            <Pressable style={styles.fullscreenContainer} onPress={handleVideoPress}>
              <VideoView
                style={styles.video}
                player={player}
                allowsFullscreen
                allowsPictureInPicture
                contentFit="contain"
              />
            </Pressable>
          )
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  video: {
    flex: 1,
  },
});
