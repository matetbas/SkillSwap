import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Settings, CreditCard, LogOut } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';
import ServiceCard from '@/components/ServiceCard';
import { Service, Transaction } from '@/types';

// Sample data
const MOCK_USER = {
  id: 'currentUser',
  pseudo: 'ThomasDubois',
  email: 'thomas.dubois@example.com',
  avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=256',
  role: 'prestataire',
  credit_dispo: 125,
  historique: ['1', '2']
};

const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    owner: MOCK_USER,
    titre: 'Cours de programmation web',
    description: 'Je propose des cours de HTML, CSS et JavaScript pour débutants',
    prix: 30,
    duree_estimee: '1:30',
    categorie: 'Informatique',
    latitude: 48.8566,
    longitude: 2.3522,
    etat: 'ouvert',
  }
];

const MOCK_RESERVATIONS: Service[] = [
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
    description: 'Chef avec 10 ans d\'expérience, je vous propose des cours de cuisine française à votre domicile.',
    prix: 50,
    duree_estimee: '2:00',
    categorie: 'Cuisine',
    latitude: 48.8566,
    longitude: 2.3522,
    etat: 'réservé',
  }
];

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'trans1',
    service: MOCK_SERVICES[0],
    demandeur: {
      id: 'user3',
      pseudo: 'PierreDurand',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=256',
      role: 'demandeur',
      credit_dispo: 120,
      historique: []
    },
    prestataire: MOCK_USER,
    montant_total: 30,
    commission_app: 3.6,
    montant_net_prestataire: 26.4,
    status: 'payé',
    created_at: new Date(Date.now() - 86400000 * 2),
  }
];

export default function DashboardScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState('services');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'services':
        return (
          <View>
            {MOCK_SERVICES.length > 0 ? (
              MOCK_SERVICES.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onPress={() => router.push(`/service/${service.id}`)}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Vous n'avez pas encore proposé de services.
                </Text>
                <Button
                  title="Proposer un service"
                  onPress={() => router.push('/(tabs)/creation-annonce')}
                  style={{ marginTop: 16 }}
                />
              </View>
            )}
          </View>
        );
      
      case 'reservations':
        return (
          <View>
            {MOCK_RESERVATIONS.length > 0 ? (
              MOCK_RESERVATIONS.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onPress={() => router.push(`/service/${service.id}`)}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Vous n'avez pas encore de réservations.
                </Text>
                <Button
                  title="Rechercher des services"
                  onPress={() => router.push('/(tabs)/liste-services')}
                  style={{ marginTop: 16 }}
                />
              </View>
            )}
          </View>
        );
      
      case 'historique':
        return (
          <View>
            {MOCK_TRANSACTIONS.length > 0 ? (
              MOCK_TRANSACTIONS.map(transaction => {
                const service = typeof transaction.service === 'string'
                  ? { titre: 'Service' }
                  : transaction.service;
                
                return (
                  <View key={transaction.id} style={styles.transactionCard}>
                    <View style={styles.transactionHeader}>
                      <Text style={styles.transactionTitle}>{service.titre}</Text>
                      <Text style={styles.transactionAmount}>
                        {transaction.montant_net_prestataire.toFixed(2)} €
                      </Text>
                    </View>
                    
                    <View style={styles.transactionDetails}>
                      <Text style={styles.transactionDate}>
                        {transaction.created_at.toLocaleDateString('fr-FR')}
                      </Text>
                      <View style={[
                        styles.statusBadge,
                        transaction.status === 'payé' && styles.paidBadge,
                        transaction.status === 'reversé' && styles.transferredBadge,
                      ]}>
                        <Text style={styles.statusText}>{transaction.status}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.transactionFooter}>
                      <Text style={styles.commissionText}>
                        Commission: {transaction.commission_app.toFixed(2)} €
                      </Text>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Vous n'avez pas encore d'historique de transactions.
                </Text>
              </View>
            )}
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: MOCK_USER.avatar }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.username}>{MOCK_USER.pseudo}</Text>
            <Text style={styles.email}>{MOCK_USER.email}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>
                {MOCK_USER.role === 'prestataire' ? 'Prestataire' : 'Demandeur'}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color={Colors.light.secondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.creditCard}>
          <View style={styles.creditCardHeader}>
            <Text style={styles.creditTitle}>Crédit disponible</Text>
            <CreditCard size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.creditAmount}>{MOCK_USER.credit_dispo} €</Text>
          <Button
            title="Recharger"
            onPress={() => console.log('Recharger crédit')}
            type="accent"
            style={styles.rechargeButton}
          />
        </View>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'services' && styles.activeTab,
            { width: width / 3 }
          ]}
          onPress={() => setActiveTab('services')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'services' && styles.activeTabText
            ]}
          >
            Mes services
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'reservations' && styles.activeTab,
            { width: width / 3 }
          ]}
          onPress={() => setActiveTab('reservations')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'reservations' && styles.activeTabText
            ]}
          >
            Réservations
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'historique' && styles.activeTab,
            { width: width / 3 }
          ]}
          onPress={() => setActiveTab('historique')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'historique' && styles.activeTabText
            ]}
          >
            Historique
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabContent}>
        {renderTabContent()}
      </View>
      
      <TouchableOpacity style={styles.logoutButton}>
        <LogOut size={20} color={Colors.light.textLight} />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
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
    paddingBottom: 24,
    backgroundColor: Colors.light.background,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.secondary,
  },
  email: {
    fontSize: 14,
    color: Colors.light.textLight,
    marginBottom: 6,
  },
  roleBadge: {
    backgroundColor: Colors.light.primary + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 12,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  settingsButton: {
    padding: 8,
  },
  creditCard: {
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  creditCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  creditTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  creditAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  rechargeButton: {
    backgroundColor: '#FFFFFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  tabButton: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.light.primary,
  },
  tabText: {
    fontSize: 14,
    color: Colors.light.textLight,
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
  tabContent: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.textLight,
    textAlign: 'center',
  },
  transactionCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.secondary,
    flex: 1,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionDate: {
    fontSize: 14,
    color: Colors.light.textLight,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.light.warning + '30',
  },
  paidBadge: {
    backgroundColor: Colors.light.success + '30',
  },
  transferredBadge: {
    backgroundColor: Colors.light.primary + '30',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.light.secondary,
  },
  transactionFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 10,
  },
  commissionText: {
    fontSize: 13,
    color: Colors.light.textLight,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 20,
    marginBottom: 40,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.light.textLight,
  },
});