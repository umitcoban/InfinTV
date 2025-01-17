import { VideoView, useVideoPlayer } from 'expo-video';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { BackHandler, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import ChannelList from './components/ChannelList';
import SearchBar from './components/SearchBar';
import { channels } from './data/channels';
import { Channel } from './types';

const VideoPlayer = memo(({ player, onPress }: { player: any; onPress: () => void }) => (
  <Pressable style={styles.fullscreenContainer} onPress={onPress}>
    <VideoView
      style={styles.video}
      player={player}
      allowsFullscreen
      allowsPictureInPicture
      contentFit="contain"
    />
  </Pressable>
));

const SearchAndChannelList = memo(({ 
  searchQuery, 
  onSearchChange, 
  onChannelSelect 
}: { 
  searchQuery: string; 
  onSearchChange: (text: string) => void; 
  onChannelSelect: (channel: Channel) => void;
}) => (
  <View style={styles.fullscreenContainer}>
    <SearchBar value={searchQuery} onChangeText={onSearchChange} />
    <ChannelList
      channels={channels}
      onChannelSelect={onChannelSelect}
      searchQuery={searchQuery}
    />
  </View>
));

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const player = useVideoPlayer(null, useCallback(player => {
    if (player) {
      player.loop = true;
    }
  }, []));

  // Kanal değiştiğinde video yükleme
  useEffect(() => {
    if (player && selectedChannel && isFullscreen) {
      const loadVideo = async () => {
        try {
          await player.replace(selectedChannel.url);
          await player.play();
        } catch (error) {
          console.error('Video yüklenirken hata:', error);
        }
      };
      loadVideo();
    }
  }, [selectedChannel, isFullscreen, player]);

  // Tam ekran değiştiğinde medya kontrolü
  useEffect(() => {
    if (!isFullscreen && player) {
      const pauseVideo = async () => {
        try {
          await player.pause();
        } catch (error) {
          console.error('Video durdurulurken hata:', error);
        }
      };
      pauseVideo();
    }
  }, [isFullscreen, player]);

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
      const pauseVideo = async () => {
        try {
          await player.pause();
        } catch (error) {
          console.error('Video durdurulurken hata:', error);
        }
      };
      pauseVideo();
    }
    setIsFullscreen(false);
  }, [player]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {!isFullscreen ? (
          <SearchAndChannelList
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onChannelSelect={handleChannelSelect}
          />
        ) : (
          selectedChannel && (
            <VideoPlayer player={player} onPress={handleVideoPress} />
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
