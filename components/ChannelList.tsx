import { FlashList } from '@shopify/flash-list';
import React, { memo, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Channel, ChannelListProps } from '../types';

const ChannelItem = memo(({ item, onSelect }: { item: Channel; onSelect: () => void }) => (
  <Pressable
    onPress={onSelect}
    style={({ pressed, focused }) => [
      styles.channelItem,
      pressed && styles.pressedItem,
      focused && styles.focusedItem
    ]}
  >
    <View style={styles.channelContent}>
      <View style={styles.channelIcon}>
        <Text style={styles.channelIconText}>{item.name[0]}</Text>
      </View>
      <View style={styles.channelInfo}>
        <Text style={styles.channelName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.channelQuality}>
          {item.url.includes('1080p') ? 'FHD' : item.url.includes('720p') ? 'HD' : 'SD'}
        </Text>
      </View>
    </View>
  </Pressable>
));

const ChannelList: React.FC<ChannelListProps> = ({ channels, onChannelSelect, searchQuery }) => {
  const filteredChannels = useMemo(() => 
    channels.filter(channel =>
      channel.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [channels, searchQuery]
  );

  const renderItem = ({ item }: { item: Channel }) => (
    <ChannelItem
      item={item}
      onSelect={() => onChannelSelect(item)}
    />
  );

  const keyExtractor = (item: Channel) => item.url;

  return (
    <View style={styles.container}>
      <FlashList
        data={filteredChannels}
        renderItem={renderItem}
        estimatedItemSize={80}
        keyExtractor={keyExtractor}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  channelItem: {
    padding: 12,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: '#252525',
    elevation: 2,
  },
  pressedItem: {
    backgroundColor: '#303030',
    transform: [{ scale: 0.98 }],
  },
  focusedItem: {
    backgroundColor: '#303030',
    borderColor: '#0066cc',
    borderWidth: 2,
  },
  channelContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  channelIconText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  channelInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  channelName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  channelQuality: {
    color: '#888',
    fontSize: 12,
  },
});

export default memo(ChannelList); 