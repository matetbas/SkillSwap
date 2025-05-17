import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin, Clock, User, MessageCircle, CreditCard } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';
import AnimatedHeader from '@/components/AnimatedHeader';
import { formatPrice, formatDuration, formatDistance } from '@/utils/formatters';
import { Service } from '@/types';

// Sample data - would be replaced with a real query
const MOCK_SERVICES: { [key: string]: Service } = {
  '1': {
    id: '1',
    owner: {
      id: 'user1',
      pseudo: 'JeanDupont',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=256',
      role: 'prestataire',
      credit_dispo: 100,
      historique: []
    },
    titre: 'Réparation ordinateur',
    description: 'Je vous propose de réparer votre ordinateur, diagnostiquer les problèmes et installer les programmes nécessaires. J\'ai 5 ans d\'expérience dans le domaine et je peux intervenir à domicile ou dans mon atelier.',
    prix: 35,
    duree_estimee: '1:30',
    categorie: 'Informatique',
    latitude: 48.8566,
    longitude: 2.3522,
    etat: 'ouvert',
  },
  '2': {
    id: '2',
    owner: {
      id: 'user2',
      pseudo: 'MarieLefebvre',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=256',
      role: 'prestataire',
      credit_dispo: 80,
      historique: []
    },
    titre: 'Cours de cuisine française',
    description: 'Chef avec 10 ans d\'expérience, je vous propose des cours de cuisine française à votre domicile. Apprenez à réaliser des plats classiques et impressionnez vos invités!',
    prix: 50,
    duree_estimee: '2:00',
    categorie: 'Cuisine',
    latitude: 48.8566,
    longitude: 2.3522,
    etat: 'ouvert',
  },
};

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(false);
  
  // In a real app, this would be a query to the database
  const service = MOCK_SERVICES[id || '1'];
  
  if (!service) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Service non trouvé</Text>
        <Button
          title="Retour à la liste"
          onPress={() => router.replace('/(tabs)/liste-services')}
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }
  
  const owner = typeof service.owner === 'string'
    ? { pseudo: 'Utilisateur', avatar: 'https://via.placeholder.com/100' }
    : service.owner;
  
  const handleContact = () => {
    // In a real app, this would create or navigate to a thread
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(`/chat/new?serviceId=${service.id}`);
    }, 500);
  };
  
  const handlePayment = () => {
    Alert.alert(
      'Paiement',
      `Voulez-vous réserver et payer ce service pour ${formatPrice(service.prix)} ?`,
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
  
  // Animation for the image
  const imageHeight = 250;
  const imageOpacity = scrollY.interpolate({
    inputRange: [0, imageHeight],
    outputRange: [1, 0.3],
    extrapolate: 'clamp',
  });
  
  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, imageHeight],
    outputRange: [0, -imageHeight / 2],
    extrapolate: 'clamp',
  });
  
  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolate: 'clamp',
  });
  
  return (
    <View style={styles.container}>
      <AnimatedHeader
        title={service.titre}
        scrollY={scrollY}
      />
      
      <Animated.View
        style={[
          styles.imageContainer,
          {
            opacity: imageOpacity,
            transform: [
              { translateY: imageTranslateY },
              { scale: imageScale },
            ],
          },
        ]}
      >
        <Image
          source={{ uri: 'https://images.pexels.com/photos/3184344/pexels-photo-3184344.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
          style={styles.coverImage}
        />
        <View style={styles.imageShadow} />
      </Animated.View>
      
      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{service.titre}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{formatPrice(service.prix)}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Clock size={18} color={Colors.light.textLight} />
              <Text style={styles.infoText}>{formatDuration(service.duree_estimee)}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <MapPin size={18} color={Colors.light.textLight} />
              <Text style={styles.infoText}>2,5 km</Text>
            </View>
            
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{service.categorie}</Text>
            </View>
          </View>
          
          <View style={styles.userContainer}>
            <Image
              source={{ uri: owner.avatar }}
              style={styles.userAvatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{owner.pseudo}</Text>
              <View style={styles.userRating}>
                <Text style={styles.ratingText}>⭐️ 4.8 (24 avis)</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{service.description}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lieu</Text>
            <View style={styles.mapPlaceholder}>
              <MapPin size={24} color={Colors.light.primary} />
              <Text style={styles.mapText}>À 2,5 km de votre position</Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations complémentaires</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoCardItem}>
                <Clock size={20} color={Colors.light.primary} />
                <View style={styles.infoCardText}>
                  <Text style={styles.infoCardTitle}>Durée estimée</Text>
                  <Text style={styles.infoCardValue}>{formatDuration(service.duree_estimee)}</Text>
                </View>
              </View>
              
              <View style={styles.infoCardDivider} />
              
              <View style={styles.infoCardItem}>
                <User size={20} color={Colors.light.primary} />
                <View style={styles.infoCardText}>
                  <Text style={styles.infoCardTitle}>Prestataire</Text>
                  <Text style={styles.infoCardValue}>{owner.pseudo}</Text>
                </View>
              </View>
              
              <View style={styles.infoCardDivider} />
              
              <View style={styles.infoCardItem}>
                <CreditCard size={20} color={Colors.light.primary} />
                <View style={styles.infoCardText}>
                  <Text style={styles.infoCardTitle}>Prix avec commission</Text>
                  <Text style={styles.infoCardValue}>{formatPrice(service.prix)}</Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.spacer} />
        </View>
      </Animated.ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.priceFooter}>
            <Text style={styles.priceLabel}>Prix</Text>
            <Text style={styles.priceValue}>{formatPrice(service.prix)}</Text>
          </View>
          
          <View style={styles.footerButtons}>
            <Button
              title="Contacter"
              onPress={handleContact}
              type="outline"
              loading={loading}
              style={styles.contactButton}
              textStyle={styles.contactButtonText}
            />
            
            <Button
              title="Réserver & Payer"
              onPress={handlePayment}
              style={styles.payButton}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: Colors.light.textLight,
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 250,
    zIndex: 1,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  imageShadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 2,
  },
  scrollView: {
    flex: 1,
    zIndex: 10,
  },
  contentContainer: {
    paddingTop: 220, // Below the image
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 30,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.secondary,
    flex: 1,
    marginRight: 8,
  },
  priceContainer: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  price: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.textLight,
    marginLeft: 4,
  },
  categoryBadge: {
    backgroundColor: Colors.light.accent + '30',
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
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 12,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.secondary,
    marginBottom: 2,
  },
  userRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: Colors.light.secondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.secondary,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.light.text,
  },
  mapPlaceholder: {
    height: 180,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.light.textLight,
  },
  infoCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
  },
  infoCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoCardText: {
    marginLeft: 12,
  },
  infoCardTitle: {
    fontSize: 14,
    color: Colors.light.textLight,
  },
  infoCardValue: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.secondary,
  },
  infoCardDivider: {
    height: 1,
    backgroundColor: Colors.light.border,
  },
  spacer: {
    height: 100, // Space for the footer
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceFooter: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: Colors.light.textLight,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.secondary,
  },
  footerButtons: {
    flexDirection: 'row',
  },
  contactButton: {
    marginRight: 10,
  },
  contactButtonText: {
    color: Colors.light.primary,
  },
  payButton: {
    paddingHorizontal: 20,
  },
});