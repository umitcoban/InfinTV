import { VideoView, useVideoPlayer } from 'expo-video';
import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import ChannelList from './components/ChannelList';
import SearchBar from './components/SearchBar';
import { channels } from './data/channels';
import { Channel } from './types';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const player = useVideoPlayer(null, player => {
    if (player) {
      player.loop = true;
    }
  });

  // Kanal değiştiğinde video yükleme
  useEffect(() => {
    if (player && selectedChannel && isFullscreen) {
      player.replace(selectedChannel.url);
      player.play();
    }
  }, [selectedChannel, isFullscreen]);

  // Tam ekran değiştiğinde medya kontrolü
  useEffect(() => {
    if (!isFullscreen && player) {
      try {
        player.pause();
      } catch (error) {
        console.error('Video durdurulurken hata:', error);
      }
    }
  }, [isFullscreen]);

  // Geri tuşu kontrolü
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isFullscreen) {
        setIsFullscreen(false);
        return true;
      }
      return false;
    });

    return () => {
      backHandler.remove();
    };
  }, [isFullscreen]);

  const handleChannelSelect = useCallback((channel: Channel) => {
    setSelectedChannel(channel);
    setIsFullscreen(true);
  }, []);

  const handleVideoPress = useCallback(() => {
    if (player) {
      try {
        player.pause();
      } catch (error) {
        console.error('Video durdurulurken hata:', error);
      }
    }
    setIsFullscreen(false);
  }, [player]);

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
