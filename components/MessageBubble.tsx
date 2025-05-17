import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/Colors';
import { Message, User } from '@/types';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

export default function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  const formattedTime = new Date(message.horodate).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={[
      styles.container,
      isCurrentUser ? styles.rightAligned : styles.leftAligned
    ]}>
      <View style={[
        styles.bubble,
        isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
      ]}>
        <Text style={[
          styles.messageText,
          isCurrentUser ? styles.currentUserText : styles.otherUserText
        ]}>
          {message.texte}
        </Text>
      </View>
      <Text style={styles.timestamp}>{formattedTime}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    marginBottom: 12,
  },
  rightAligned: {
    alignSelf: 'flex-end',
  },
  leftAligned: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  currentUserBubble: {
    backgroundColor: Colors.light.primary,
  },
  otherUserBubble: {
    backgroundColor: '#F0F0F0',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  currentUserText: {
    color: '#FFFFFF',
  },
  otherUserText: {
    color: Colors.light.secondary,
  },
  timestamp: {
    fontSize: 11,
    color: Colors.light.textLight,
    marginTop: 2,
    marginHorizontal: 4,
  },
});