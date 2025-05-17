import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Animated } from 'react-native';
import { MapPin, Clock } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Service, User } from '@/types';
import { formatPrice, formatDistance, formatDuration } from '@/utils/formatters';

interface ServiceCardProps {
  service: Service;
  distance?: number;
  onPress: () => void;
}

export default function ServiceCard({ service, distance, onPress }: ServiceCardProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // Determine if owner is User object or string (id)
  const owner = typeof service.owner === 'string' 
    ? { pseudo: 'Utilisateur', avatar: 'https://via.placeholder.com/40' } 
    : service.owner as User;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.header}>
          <Image
            source={{ uri: owner.avatar }}
            style={styles.avatar}
          />
          <View style={styles.headerText}>
            <Text style={styles.title} numberOfLines={1}>
              {service.titre}
            </Text>
            <Text style={styles.username}>{owner.pseudo}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatPrice(service.prix)}</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {service.description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Clock size={16} color={Colors.light.textLight} />
            <Text style={styles.footerText}>
              {formatDuration(service.duree_estimee)}
            </Text>
          </View>

          {distance !== undefined && (
            <View style={styles.footerItem}>
              <MapPin size={16} color={Colors.light.textLight} />
              <Text style={styles.footerText}>{formatDistance(distance)}</Text>
            </View>
          )}

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{service.categorie}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.secondary,
  },
  username: {
    fontSize: 14,
    color: Colors.light.textLight,
  },
  priceContainer: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  price: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  description: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  footerText: {
    fontSize: 13,
    color: Colors.light.textLight,
    marginLeft: 4,
  },
  categoryBadge: {
    backgroundColor: Colors.light.accent + '30', // 30% opacity
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginLeft: 'auto',
  },
  categoryText: {
    fontSize: 12,
    color: Colors.light.secondary,
    fontWeight: '500',
  },
});