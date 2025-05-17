import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Slider from '../../components/Slider';

export default function CreationAnnonceScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [prix, setPrix] = useState('');
  const [dureeHeures, setDureeHeures] = useState(0);
  
  const handleNext = () => {
    if (currentStep === 1) {
      // Validate first step
      if (!titre || !description || !prix) {
        return;
      }
      setCurrentStep(2);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView 
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.stepIndicator}>
            {currentStep}/2
          </Text>
          <Text style={styles.title}>Proposer un service</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Titre"
            placeholder="Cours de cuisine italienne"
            value={titre}
            onChangeText={setTitre}
            autoCapitalize="sentences"
          />

          <Input
            label="Description"
            placeholder="Décrivez votre service..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={200}
          />

          <Input
            label="Prix (€)"
            placeholder="25"
            value={prix}
            onChangeText={setPrix}
            keyboardType="numeric"
          />

          <View style={styles.durationContainer}>
            <Text style={styles.label}>Durée estimée</Text>
            <Slider
              value={dureeHeures}
              onValueChange={setDureeHeures}
              minimumValue={0}
              maximumValue={8}
              step={0.5}
            />
            <View style={styles.durationLabels}>
              <Text style={styles.durationLabel}>0 h</Text>
              <Text style={styles.durationLabel}>8 h</Text>
            </View>
          </View>

          <Button
            title="Suivant"
            onPress={handleNext}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  stepIndicator: {
    fontSize: 15,
    color: Colors.light.textLight,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 24,
  },
  form: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 8,
  },
  durationContainer: {
    marginBottom: 24,
  },
  durationLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  durationLabel: {
    fontSize: 14,
    color: Colors.light.textLight,
  },
  button: {
    marginTop: 24,
    marginBottom: Platform.OS === 'ios' ? 40 : 24,
  },
});