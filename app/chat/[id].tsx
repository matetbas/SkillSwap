import React, { useState, useRef, useEffect } from 'react';
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
import { ArrowLeft, Send, CreditCard } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';
import MessageBubble from '@/components/MessageBubble';
import { Message, User } from '@/types';

// Sample data - would be replaced with a real query
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

// Sample thread data
const MOCK_THREAD_DATA: { [key: string]: Message[] } = {
  '1': [
    {
      id: 'msg1',
      thread_id: '1',
      sender: MOCK_USERS['currentUser'],
      texte: 'Bonjour, je suis intéressé par votre service de réparation d\'ordinateur.',
      horodate: new Date(Date.now() - 3600000 * 2), // 2 hours ago
    },
    {
      id: 'msg2',
      thread_id: '1',
      sender: MOCK_USERS['user1'],
      texte: 'Bonjour ! Bien sûr, je suis disponible. Quel est votre problème ?',
      horodate: new Date(Date.now() - 3600000 * 1.5), // 1.5 hours ago
    },
    {
      id: 'msg3',
      thread_id: '1',
      sender: MOCK_USERS['currentUser'],
      texte: 'Mon ordinateur est très lent au démarrage et certains programmes se bloquent régulièrement.',
      horodate: new Date(Date.now() - 3600000), // 1 hour ago
    },
    {
      id: 'msg4',
      thread_id: '1',
      sender: MOCK_USERS['user1'],
      texte: 'Je vois. C\'est probablement dû à des logiciels qui se lancent au démarrage ou à un disque dur saturé. Je peux vous aider avec ça. Quand seriez-vous disponible ?',
      horodate: new Date(Date.now() - 3600000 / 2), // 30 minutes ago
    },
  ],
  'new': [], // Empty thread for new conversations
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  
  const [messages, setMessages] = useState<Message[]>(MOCK_THREAD_DATA[id || 'new'] || []);
  const [newMessage, setNewMessage] = useState('');
  const [showPaymentOption, setShowPaymentOption] = useState(false);
  
  const otherUser = MOCK_USERS['user1']; // In a real app, get this from the thread participants
  const currentUser = MOCK_USERS['currentUser'];
  
  // In a real app, this would be a subscription to the messages collection
  useEffect(() => {
    // Show payment option after a few messages
    if (messages.length >= 4) {
      setShowPaymentOption(true);
    }
  }, [messages]);
  
  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: `msg_${Date.now()}`,
      thread_id: id || 'new',
      sender: currentUser,
      texte: newMessage.trim(),
      horodate: new Date(),
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    // In a real app, this would save the message to the database
    
    // Auto-scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };
  
  const handlePayment = () => {
    Alert.alert(
      'Réserver et payer',
      'Voulez-vous réserver ce service pour 35€ ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Payer',
          onPress: () => {
            // In a real app, this would process the payment
            Alert.alert(
              'Paiement effectué',
              'Votre réservation a été confirmée et le prestataire a été notifié.',
              [
                {
                  text: 'OK',
                  onPress: () => router.replace('/(tabs)/dashboard'),
                },
              ]
            );
          },
        },
      ]
    );
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
            <Text style={styles.serviceTitle}>Réparation ordinateur</Text>
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
                Aucun message pour le moment. Envoyez un message pour commencer la conversation.
              </Text>
            </View>
          }
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
        />
        
        {showPaymentOption && (
          <View style={styles.paymentContainer}>
            <View style={styles.paymentCard}>
              <Text style={styles.paymentTitle}>
                Prêt à réserver ce service ?
              </Text>
              <View style={styles.paymentInfo}>
                <CreditCard size={18} color={Colors.light.primary} />
                <Text style={styles.paymentPrice}>35,00 €</Text>
              </View>
              <Button
                title="Réserver & Payer"
                onPress={handlePayment}
                style={styles.paymentButton}
              />
            </View>
          </View>
        )}
        
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
  paymentContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  paymentCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
  },
  paymentTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.secondary,
    marginBottom: 8,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.primary,
    marginLeft: 6,
  },
  paymentButton: {
    marginTop: 8,
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