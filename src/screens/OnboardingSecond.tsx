import { Text, View, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icons } from '../assets/images/svg';
import GradientButton from '../components/GradientButton';
import BoardInfo from '../components/BoardInfo';


export default function OnboardingSecond() {
    const { t } = useTranslation();
    const nav = useNavigation<any>();
    const insets = useSafeAreaInsets();

    return (
        <ImageBackground source={require('../assets/images/secondBoard.png')} style={[styles.container, { paddingTop: insets.top + 16 }]} >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <TouchableOpacity onPress={() => nav.goBack()}>
                    <Icons.Left />
                </TouchableOpacity>
                <Text style={styles.brand}>2 of 3</Text>
                <View></View>
            </View>
            <View style={{ paddingBottom: 20, gap: 16 ,}}><Text style={styles.welcome}>The Power of {'\n'}<Text style={{ color: '#4169E1' }}>Energy Exchange </Text></Text>
                <Text style={styles.subtitle}>Universal energy flows connect all living beings. Learn how to channel this force for your destiny.</Text>
                <BoardInfo icon={<Icons.Repeat />} title='Continuous Exchange' subtitle='Energy flows in cycles. Give and receive to maintain harmony and unlock your potential.' />
                <BoardInfo icon={<Icons.Stars />} title='Transform Your Fate' subtitle="Channel cosmic forces to reshape your destiny and align with your soul's true purpose." />
                <BoardInfo icon={<Icons.Spirit />} title='Elevate Your Spirit' subtitle='Connect with universal wisdom to strengthen your inner self and achieve spiritual growth.' />

               
            </View>
            <GradientButton
                    iconLeft={<Icons.Question />}
                    icon={<Icons.Right />}
                    title="Start Journey"
                    colors={['#4169E1', '#A855F7', '#FFD700']}
                    locations={[0.3, 0.4, 0.9]}
                    onClickButton={() => nav.navigate('OnboardingThird')}
                />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.bg,
      justifyContent: 'space-between',
        padding: 16,
        paddingBottom:70
    },
    header: {
        marginTop: 40,
        marginBottom: 32,
    },
    brand: {
        color: 'rgba(107, 114, 128, 1)',
        fontSize: 12,
        fontWeight: '500',
    },
    welcome: {
        color: '#fff',
        fontSize: 28,
        // textAlign: 'center',
        fontWeight: '800',
        marginBottom: 4
    },
    subtitle: {
        color: '#9CA3AF',
        fontSize: 14,
        fontWeight: '300',
        lineHeight: 23,
        textAlign: 'center',
    },
    form: {
        flex: 1,
    },
    inputContainer: {
        marginBottom: 16,
    },
    fieldErrorText: {
        color: '#FF4444',
        fontSize: 12,
        fontWeight: '500',
        marginTop: 4,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.card,
        borderColor: theme.colors.border,
        borderWidth: 2,
        borderRadius: theme.radius,
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
    },
    input: {
        flex: 1,
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: '500',
    },
    eyeButton: {
        padding: 4,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: theme.colors.subtext,
        fontSize: 14,
        fontWeight: '500',
    },
    loginButton: {
        marginBottom: 16,
    },
    appleButton: {
        marginBottom: 24,
    },
    errorText: {
        color: '#FF4444',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 16,
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signUpText: {
        color: theme.colors.subtext,
        fontSize: 14,
    },
    signUpLink: {
        color: theme.colors.text,
        fontSize: 14,
        fontWeight: '600',
    },
});
