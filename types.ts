export interface Channel {
  name: string;
  url: string;
}

export interface ChannelListProps {
  channels: Channel[];
  onChannelSelect: (channel: Channel) => void;
  searchQuery: string;
} 