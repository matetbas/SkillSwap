import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Sliders } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import ServiceCard from '@/components/ServiceCard';
import CategoryPicker from '@/components/CategoryPicker';
import AnimatedHeader from '@/components/AnimatedHeader';
import { Categories } from '@/types';

// Sample data - would be replaced with real data from Firebase
const MOCK_SERVICES = [
  {
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
    description: 'Je vous propose de réparer votre ordinateur, diagnostiquer les problèmes et installer les programmes nécessaires.',
    prix: 35,
    duree_estimee: '1:30',
    categorie: 'Informatique',
    latitude: 48.8566,
    longitude: 2.3522,
    etat: 'ouvert',
  },
  {
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
  {
    id: '3',
    owner: {
      id: 'user3',
      pseudo: 'PierreDurand',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=256',
      role: 'prestataire',
      credit_dispo: 120,
      historique: []
    },
    titre: 'Jardinage et entretien',
    description: 'Je m\'occupe de l\'entretien de votre jardin : tonte de pelouse, taille de haies, désherbage, et plus encore.',
    prix: 25,
    duree_estimee: '2:00',
    categorie: 'Jardinage',
    latitude: 48.8566,
    longitude: 2.3522,
    etat: 'ouvert',
  },
];

export default function ListeServicesScreen() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState(MOCK_SERVICES);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Categories | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [priceMax, setPriceMax] = useState<string>('');
  const [distance, setDistance] = useState<string>('30');

  const filteredServices = services.filter(service => {
    const matchesSearch = searchText === '' || 
      service.titre.toLowerCase().includes(searchText.toLowerCase()) ||
      service.description.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesCategory = !selectedCategory || service.categorie === selectedCategory;
    
    const matchesPrice = !priceMax || service.prix <= parseInt(priceMax);
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleServicePress = (serviceId: string) => {
    router.push(`/service/${serviceId}`);
  };

  return (
    <View style={styles.container}>
      <AnimatedHeader 
        title="Rechercher un service" 
        scrollY={scrollY}
        showBackButton={false}
      />
      
      <Animated.FlatList
        data={filteredServices}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <>
            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <Search size={20} color={Colors.light.textLight} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Rechercher un service..."
                  value={searchText}
                  onChangeText={setSearchText}
                />
              </View>
              
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => setShowFilters(!showFilters)}
              >
                <Sliders size={20} color={Colors.light.primary} />
              </TouchableOpacity>
            </View>
            
            <CategoryPicker
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            
            {showFilters && (
              <View style={styles.filtersContainer}>
                <Text style={styles.filterTitle}>Filtres</Text>
                
                <View style={styles.filterItem}>
                  <Text style={styles.filterLabel}>Prix maximum (€)</Text>
                  <TextInput
                    style={styles.filterInput}
                    value={priceMax}
                    onChangeText={setPriceMax}
                    keyboardType="numeric"
                    placeholder="Aucune limite"
                  />
                </View>
                
                <View style={styles.filterItem}>
                  <Text style={styles.filterLabel}>Distance ({distance} km)</Text>
                  {/* In a real app, this would be a slider component */}
                  <TextInput
                    style={styles.filterInput}
                    value={distance}
                    onChangeText={setDistance}
                    keyboardType="numeric"
                    placeholder="30"
                  />
                </View>
              </View>
            )}
            
            <Text style={styles.resultsCount}>
              {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} trouvé{filteredServices.length !== 1 ? 's' : ''}
            </Text>
          </>
        }
        renderItem={({ item }) => (
          <ServiceCard
            service={item}
            distance={2.5} // In a real app, calculate actual distance
            onPress={() => handleServicePress(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Aucun service ne correspond à votre recherche.
            </Text>
          </View>
        }
        ListFooterComponent={loading ? <ActivityIndicator size="large" color={Colors.light.primary} /> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  listContent: {
    paddingTop: 110, // Account for header + search
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.light.text,
  },
  filterButton: {
    marginLeft: 12,
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: Colors.light.secondary,
  },
  filterItem: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    marginBottom: 6,
    color: Colors.light.secondary,
  },
  filterInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
    color: Colors.light.textLight,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.textLight,
    textAlign: 'center',
  },
});