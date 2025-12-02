import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, Modal, Platform, TextInput, TouchableWithoutFeedback, Alert, Keyboard, KeyboardAvoidingView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CoinsHeader from '../components/CoinsHeader';
import { Icons } from '../assets/images/svg';
import { theme, getFontFamily } from '../theme';
import { useDispatch, useSelector } from 'react-redux';
import { purchaseCard } from '../store/slices/cardPurchaseSlice';
import { coinsBalanceSelector } from '../store/selectors/authSelector';
import { RootState } from '../store/config/configStore';
import { useApp } from '../store/app';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CardInfoScreen() {
  const { t } = useTranslation();
  const route = useRoute<any>();
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const card = route.params?.card;
  const dispatch = useDispatch();
  const coinsBalance = useSelector(coinsBalanceSelector);
  const buyCard = useApp(s => s.buyCard);
  const charge = useApp(s => s.chargeCardName);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const isLoading = useSelector((state: RootState) => state.cardPurchaseReducer.loading);
  const error = useSelector((state: RootState) => state.cardPurchaseReducer.error);

  // Show error alerts
  useEffect(() => {
    if (error) {
      Alert.alert('Purchase Error', error);
    }
  }, [error]);

  const onBuy = async () => {
    // Dismiss keyboard if open
    Keyboard.dismiss();
    
    // Check coins balance
    if (coinsBalance === 0) {
      Alert.alert(
        t('common.insufficientCoins'),
        'You need coins to purchase this card. Would you like to buy coins?',
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('common.buyCoins'), onPress: () => nav.navigate('CoinsPurchaseModal') },
        ]
      );
      return;
    }

    // Show confirmation alert before purchasing
    Alert.alert(
      t('common.confirmPurchase'),
      t('common.confirmCardPurchase', { price: card.price }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.yesBuy'),
          onPress: async () => {
            await buyCard(card.id);
            Keyboard.dismiss();
            setModalVisible(true);
          }
        }
      ]
    );
  };

  const onConfirm = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }

    charge(card.id, name || '—');

    // Format birthday as YYYY-MM-DD
    const formattedBirthday = birthday.toISOString().split('T')[0];

    // Call purchase endpoint with name, surname and birthday
    dispatch(purchaseCard(card.id, name, surname, formattedBirthday, () => {
      setModalVisible(false);
      setSuccessModalVisible(true);
    }) as any);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || birthday;
    setShowDatePicker(Platform.OS === 'ios');
    setBirthday(currentDate);
  };

  return (
    <ImageBackground 
      source={require('../assets/images/onboard.png')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <CoinsHeader />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          {/* Decorative top element */}
          <View style={styles.decorativeTop}>
            <View style={styles.decorativeCircle} />
            <View style={[styles.decorativeCircle, styles.decorativeCircleSmall]} />
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <View style={styles.titleIconContainer}>
              <Icons.Spirit width={32} height={32} />
            </View>
            <Text style={styles.title}>{card?.title || 'Card Information'}</Text>
            <View style={styles.titleUnderline} />
          </View>

          {/* Description Section */}
          {card?.description && (
            <View style={styles.descriptionSection}>
              <View style={styles.descriptionHeader}>
                <View style={styles.descriptionIconLine} />
                <Text style={styles.descriptionLabel}>Description</Text>
                <View style={styles.descriptionIconLine} />
              </View>
              <View style={styles.descriptionCard}>
                <Text style={styles.descriptionText}>{card.description}</Text>
              </View>
            </View>
          )}

          {/* Additional Info Section */}
       

          {/* Price Section */}
          {card?.price && (
            <View style={styles.priceSection}>
              <View style={styles.priceCard}>
                <Icons.Gold width={28} height={28} />
                <Text style={styles.priceLabel}>Price</Text>
                <Text style={styles.priceValue}>{card.price}</Text>
              </View>
              <TouchableOpacity 
                style={styles.buyButton} 
                onPress={onBuy}
              >
                <Text style={styles.buyButtonText}>{t('cta.buy')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Bottom decorative element */}
          <View style={styles.decorativeBottom}>
            <View style={styles.decorativeCircle} />
          </View>
        </View>
      </ScrollView>

      {/* Activation Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onShow={() => Keyboard.dismiss()}
      >
        <TouchableWithoutFeedback onPress={() => {
          Keyboard.dismiss();
          setModalVisible(false);
        }}>
          <KeyboardAvoidingView 
            style={styles.modalBackground}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          >
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.bottomSheet}>
                <ScrollView 
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={styles.modalScrollContent}
                >
                  <Text style={styles.modalTitle}>Activation</Text>
                  <Text style={styles.modalSubtitle}>Enter your details to connect with the energy flow.</Text>
                  <Text style={styles.modalLabel}>Name</Text>
                  <View style={styles.inputContainer}>
                    <Icons.Name style={styles.icon} />
                    <TextInput
                      placeholder={t('common.enterYourName')}
                      placeholderTextColor="#AAA"
                      value={name}
                      onChangeText={setName}
                      style={[styles.input, { color: '#fff' }]}
                    />
                  </View>

                  <Text style={styles.modalLabel}>Surname</Text>
                  <View style={styles.inputContainer}>
                    <Icons.Surname style={styles.icon} />
                    <TextInput
                      placeholder={t('common.enterYourSurname')}
                      placeholderTextColor="#AAA"
                      value={surname}
                      onChangeText={setSurname}
                      style={[styles.input, { color: '#fff' }]}
                    />
                  </View>

                  <Text style={styles.modalLabel}>{t('common.dateOfBirth')}</Text>
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => {
                      Keyboard.dismiss();
                      setShowDatePicker(true);
                    }}
                  >
                    <Icons.Calendar style={styles.icon} />
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
                      textColor="#fff"
                      themeVariant="dark"
                    />
                  )}

                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={onConfirm}
                    disabled={isLoading}
                  >
                    <Text style={styles.confirmButtonText}>
                      {isLoading ? t('common.loading') : t('common.confirm')}
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Success Modal */}
      <Modal
        transparent={true}
        visible={successModalVisible}
        animationType="fade"
      >
        <TouchableWithoutFeedback onPress={() => {
          setSuccessModalVisible(false);
          nav.goBack();
        }}>
          <View style={styles.successModalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.successModalContent}>
                <Text style={styles.successTitle}>{t('common.congratulations')}</Text>
                <Text style={styles.successText}>{t('common.cardPurchaseSuccess')}</Text>
                <TouchableOpacity
                  style={styles.successButton}
                  onPress={() => {
                    setSuccessModalVisible(false);
                    nav.goBack();
                  }}
                >
                  <Text style={styles.successButtonText}>{t('common.ok')}</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  contentWrapper: {
    flex: 1,
  },
  decorativeTop: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
    height: 40,
  },
  decorativeCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
    position: 'absolute',
  },
  decorativeCircleSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 212, 255, 0.25)',
    top: 10,
    left: 10,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  titleIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    fontFamily: getFontFamily('800'),
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  titleUnderline: {
    width: 80,
    height: 3,
    backgroundColor: 'rgba(0, 212, 255, 0.6)',
    borderRadius: 2,
  },
  descriptionSection: {
    marginBottom: 32,
  },
  descriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  descriptionIconLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  descriptionLabel: {
    color: '#00D4FF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: getFontFamily('700'),
    paddingHorizontal: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  descriptionCard: {
    backgroundColor: 'rgba(15, 17, 26, 0.7)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
    shadowColor: '#00D4FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  descriptionText: {
    color: '#E5E7EB',
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '400',
    fontFamily: getFontFamily('400'),
    letterSpacing: 0.3,
  },
  infoSection: {
    marginBottom: 32,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingLeft: 4,
  },
  infoTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: getFontFamily('700'),
    letterSpacing: 0.5,
  },
  infoCard: {
    backgroundColor: 'rgba(15, 17, 26, 0.6)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoText: {
    color: '#D1D5DB',
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '400',
    fontFamily: getFontFamily('400'),
  },
  priceSection: {
    marginBottom: 32,
  },
  priceCard: {
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  priceLabel: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: getFontFamily('600'),
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  priceValue: {
    color: '#FBBF24',
    fontSize: 28,
    fontWeight: '800',
    fontFamily: getFontFamily('800'),
    letterSpacing: 1,
  },
  decorativeBottom: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  buyButton: {
    backgroundColor: '#00B149DE',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
    fontFamily: getFontFamily('900'),
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
  },
  bottomSheet: {
    backgroundColor: 'rgba(21, 21, 34, 0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginBottom: 80,
    maxHeight: '90%',
  },
  modalScrollContent: {
    padding: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    fontFamily: getFontFamily('600'),
    textAlign: 'center',
    marginBottom: 12,
  },
  modalSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: getFontFamily('400'),
    textAlign: 'center',
    marginBottom: 20,
  },
  modalLabel: {
    color: '#B0B0C0',
    fontSize: 16,
    fontWeight: '400',
    fontFamily: getFontFamily('400'),
    marginTop: 20,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(44, 44, 62, 1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'rgba(30, 30, 46, 1)',
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  icon: {
    marginRight: 8,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#2C2C3E',
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    backgroundColor: '#1E1E2E',
  },
  datePickerText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: getFontFamily('400'),
  },
  confirmButton: {
    backgroundColor: '#00B149DE',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: getFontFamily('700'),
  },
  successModalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  successModalContent: {
    backgroundColor: 'rgba(21, 21, 34, 0.95)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  successTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '400',
    fontFamily: getFontFamily('400'),
    textAlign: 'center',
    marginBottom: 16,
  },
  successText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '400',
    fontFamily: getFontFamily('400'),
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  successButton: {
    backgroundColor: '#00B149DE',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  successButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: getFontFamily('700'),
  },
});

