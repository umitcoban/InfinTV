import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Channel, ChannelListProps } from '../types';

const ChannelList: React.FC<ChannelListProps> = ({ channels, onChannelSelect, searchQuery }) => {
  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: Channel }) => (
    <Pressable
      onPress={() => onChannelSelect(item)}
      style={({ focused }) => [styles.channelItem, focused && styles.focusedItem]}
    >
      <Text style={styles.channelName}>{item.name}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <FlashList
        data={filteredChannels}
        renderItem={renderItem}
        estimatedItemSize={50}
        keyExtractor={(item) => item.url}
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
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  focusedItem: {
    backgroundColor: '#333',
  },
  channelName: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ChannelList; 