import { Text, View, StyleSheet, ScrollView, ImageBackground, } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { Icons } from '../assets/images/svg';
import GradientButton from '../components/GradientButton';


export default function OnboardingFirst() {
    const { t } = useTranslation();
    // const nav = useNavigation<any>();

    return (
        <ImageBackground source={require('../assets/images/onboard.png')} style={styles.container} >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Icons.Stream /> <Text style={styles.brand}>Flow up</Text>
            </View>
            <View style={{paddingBottom:70,gap:32}}><Text style={styles.welcome}>Unlock Your <Text style={{ color: '#4169E1' }}>Cosmic Destiny </Text></Text>
                <Text style={styles.subtitle}>Discover how universal energy flows shape your path. Harness the power of exchange to elevate your soul and transform your fate.</Text>
                <Icons.DotsStart style={{alignSelf:'center'}} />
                <GradientButton
                    iconLeft={<Icons.Question />}
                    icon={<Icons.Right />}
                    title="Start Journey"
                    colors={['#4169E1', '#A855F7', '#FFD700']}
                    locations={[0.3, 0.4, 0.9]}
                />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.bg,
        justifyContent: 'space-between',
        padding: 16
    },
    header: {
        marginTop: 40,
        marginBottom: 32,
    },
    brand: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    welcome: {
        color: '#fff',
        fontSize: 28,
        textAlign: 'center',
        fontWeight: '800',
        marginBottom: 4
    },
    subtitle: {
        color:'#9CA3AF',
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
