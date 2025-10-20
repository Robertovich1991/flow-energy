
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { PrimaryButton } from '../components/Buttons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useApp } from '../store/app';
import { useDispatch, useSelector } from 'react-redux';
import { purchaseCard } from '../store/slices/cardPurchaseSlice';
import { RootState } from '../store/config/configStore';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function NameChargeModal() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const id = route.params?.id;
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const charge = useApp(s => s.chargeCardName);
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.cardPurchaseReducer.loading);
  const error = useSelector((state: RootState) => state.cardPurchaseReducer.error);

  // Show error alerts
  useEffect(() => {
    if (error) {
      Alert.alert('Purchase Error', error);
    }
  }, [error]);

  const onConfirm = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }
    
    charge(id, name || '—');
    
    // Format birthday as YYYY-MM-DD
    const formattedBirthday = birthday.toISOString().split('T')[0];
    
    // Call purchase endpoint with name and birthday, then navigate back
    dispatch(purchaseCard(id, name, formattedBirthday, () => {
      Alert.alert('Successfully');
      nav.goBack();
    }) as any);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || birthday;
    setShowDatePicker(Platform.OS === 'ios');
    setBirthday(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Зарядка на имя</Text>
      <Text style={styles.sub}>Введите имя человека, на которого зарядить карту.</Text>
      
      <TextInput 
        placeholder={t('fields.name') as string} 
        placeholderTextColor="#AAA" 
        value={name}
        onChangeText={setName} 
        style={styles.input} 
      />
      
      <Text style={styles.label}>Дата рождения</Text>
      <TouchableOpacity 
        style={styles.datePickerButton} 
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.datePickerText}>
          {birthday.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })}
        </Text>
      </TouchableOpacity>
      
      {showDatePicker && (
        <DateTimePicker
          value={birthday}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
          textColor="#fff"
          themeVariant="dark"
        />
      )}
      
      <PrimaryButton 
        label={isLoading ? t('common.processing') : t('cta.confirm')} 
        onPress={onConfirm} 
        style={styles.confirmButton}
        disabled={!!isLoading}
        loading={!!isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: theme.colors.bg, padding:16 },
  title: { color:'#fff', fontSize:28, fontWeight:'900' },
  sub: { color: theme.colors.subtext, marginTop:8 },
  input: { marginTop:12, borderWidth:2, borderColor: theme.colors.border, borderRadius:16, padding:12, color:'#fff' },
  label: { 
    color:'#fff', 
    fontSize:16, 
    fontWeight:'600', 
    marginTop:20, 
    marginBottom:8 
  },
  datePickerButton: { 
    marginTop:8, 
    borderWidth:2, 
    borderColor: theme.colors.border, 
    borderRadius:16, 
    padding:12,
    backgroundColor: 'rgba(255,255,255,0.1)'
  },
  datePickerText: { 
    color:'#fff', 
    fontSize:16 
  },
  confirmButton: { 
    flex: 0, 
    alignSelf: 'center',
    minWidth: 200,
    marginTop: 20
  },
  note: { color: theme.colors.subtext, marginTop:12 }
});
