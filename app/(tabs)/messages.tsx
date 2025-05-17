import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Thread } from '@/types';

// Sample data - would be replaced with real data from Firebase
const MOCK_THREADS: Thread[] = [
  {
    id: '1',
    participants: ['currentUser', 'user1'],
    lastMessage: {
      id: 'msg1',
      thread_id: '1',
      sender: {
        id: 'user1',
        pseudo: 'JeanDupont',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=256',
        role: 'prestataire',
        credit_dispo: 100,
        historique: []
      },
      texte: 'Bonjour, je suis intéressé par votre service',
      horodate: new Date(Date.now() - 3600000), // 1 hour ago
    },
    service: '1',
    created_at: new Date(Date.now() - 86400000), // 1 day ago
  },
  {
    id: '2',
    participants: ['currentUser', 'user2'],
    lastMessage: {
      id: 'msg2',
      thread_id: '2',
      sender: {
        id: 'currentUser',
        pseudo: 'CurrentUser',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=256',
        role: 'demandeur',
        credit_dispo: 200,
        historique: []
      },
      texte: 'Merci pour votre réponse rapide',
      horodate: new Date(Date.now() - 10800000), // 3 hours ago
    },
    service: '2',
    created_at: new Date(Date.now() - 172800000), // 2 days ago
  },
];

export default function MessagesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [threads, setThreads] = useState(MOCK_THREADS);
  
  const filteredThreads = searchQuery.trim() === ''
    ? threads
    : threads.filter(thread => {
        const lastMessage = thread.lastMessage;
        if (!lastMessage) return false;
        
        const senderPseudo = typeof lastMessage.sender === 'string'
          ? lastMessage.sender
          : lastMessage.sender.pseudo;
        
        return (
          senderPseudo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lastMessage.texte.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  };
  
  const handleThreadPress = (threadId: string) => {
    router.push(`/chat/${threadId}`);
  };
  
  const renderThreadItem = ({ item }: { item: Thread }) => {
    if (!item.lastMessage) return null;
    
    const sender = typeof item.lastMessage.sender === 'string'
      ? { pseudo: 'Utilisateur', avatar: 'https://via.placeholder.com/40' }
      : item.lastMessage.sender;
    
    const isCurrentUserLastSender = typeof item.lastMessage.sender === 'object' && 
      item.lastMessage.sender.id === 'currentUser';
    
    return (
      <TouchableOpacity
        style={styles.threadItem}
        onPress={() => handleThreadPress(item.id)}
      >
        <Image source={{ uri: sender.avatar }} style={styles.avatar} />
        
        <View style={styles.threadContent}>
          <View style={styles.threadHeader}>
            <Text style={styles.username}>{sender.pseudo}</Text>
            <Text style={styles.timestamp}>
              {formatTime(item.lastMessage.horodate)}
            </Text>
          </View>
          
          <Text 
            style={[
              styles.lastMessage,
              isCurrentUserLastSender && styles.currentUserMessage
            ]}
            numberOfLines={1}
          >
            {isCurrentUserLastSender ? 'Vous: ' : ''}
            {item.lastMessage.texte}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <View style={styles.searchContainer}>
          <Search size={18} color={Colors.light.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      {filteredThreads.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery.trim() !== ''
              ? 'Aucun message ne correspond à votre recherche.'
              : 'Vous n\'avez pas encore de messages.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredThreads}
          keyExtractor={item => item.id}
          renderItem={renderThreadItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: Colors.light.secondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.light.text,
  },
  listContent: {
    paddingTop: 8,
  },
  threadItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  threadContent: {
    flex: 1,
    justifyContent: 'center',
  },
  threadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.secondary,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.light.textLight,
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.light.text,
  },
  currentUserMessage: {
    color: Colors.light.textLight,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.textLight,
    textAlign: 'center',
  },
});