import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import MessageBubble from '@/components/MessageBubble';
import { Message, User } from '@/types';

// Sample data
const MOCK_USERS: { [key: string]: User } = {
  'currentUser': {
    id: 'currentUser',
    pseudo: 'CurrentUser',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=256',
    role: 'demandeur',
    credit_dispo: 200,
    historique: []
  },
  'user1': {
    id: 'user1',
    pseudo: 'JeanDupont',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=256',
    role: 'prestataire',
    credit_dispo: 100,
    historique: []
  },
};

export default function NewChatScreen() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  const otherUser = MOCK_USERS['user1']; // In a real app, get this from the service owner
  const currentUser = MOCK_USERS['currentUser'];
  
  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: `msg_${Date.now()}`,
      thread_id: 'new',
      sender: currentUser,
      texte: newMessage.trim(),
      horodate: new Date(),
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    // In a real app, this would save the message to the database and create a thread
    
    // Auto-scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
    
    // Simulate response after first message
    if (messages.length === 0) {
      setTimeout(() => {
        const responseMessage: Message = {
          id: `msg_response_${Date.now()}`,
          thread_id: 'new',
          sender: otherUser,
          texte: 'Bonjour ! Merci pour votre message. Comment puis-je vous aider ?',
          horodate: new Date(),
        };
        
        setMessages(prev => [...prev, responseMessage]);
        
        // Auto-scroll to bottom
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, 1500);
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.light.secondary} />
          </TouchableOpacity>
          
          <Image source={{ uri: otherUser.avatar }} style={styles.avatar} />
          
          <View style={styles.headerInfo}>
            <Text style={styles.username}>{otherUser.pseudo}</Text>
            <Text style={styles.serviceTitle}>Nouveau message</Text>
          </View>
        </View>
        
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              isCurrentUser={item.sender.id === currentUser.id}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Commencez la conversation en envoyant un message.
              </Text>
            </View>
          }
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
        />
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Écrivez un message..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !newMessage.trim() && styles.disabledSendButton,
            ]}
            onPress={handleSend}
            disabled={!newMessage.trim()}
          >
            <Send
              size={20}
              color={newMessage.trim() ? '#FFFFFF' : '#AAAAAA'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    paddingTop: 50,
  },
  backButton: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerInfo: {
    marginLeft: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.secondary,
  },
  serviceTitle: {
    fontSize: 13,
    color: Colors.light.textLight,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.light.textLight,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: Colors.light.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledSendButton: {
    backgroundColor: '#E0E0E0',
  },
});