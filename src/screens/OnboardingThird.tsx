import { Text, View, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icons } from '../assets/images/svg';
import GradientButton from '../components/GradientButton';
import BoardInfo from '../components/BoardInfo';
import BoardCard from '../components/BoardCard';


export default function OnboardingThird() {
    const { t } = useTranslation();
    const nav = useNavigation<any>();
    const insets = useSafeAreaInsets();

    return (
        <ImageBackground source={require('../assets/images/boardThree.png')} style={[styles.container, { paddingTop: insets.top + 16 }]} >
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <TouchableOpacity onPress={() => nav.goBack()}>
                        <Icons.Left />
                    </TouchableOpacity>
                    <Text style={styles.brand}>3 of 3</Text>
                    <View>

                    </View>
                </View>
                <View>
                    <Text style={styles.welcome}>Begin Your  {'\n'}<Text style={{ color: '#ffd747ff' }}>Enlightenment </Text></Text>
                    <Text style={styles.subtitle}>We invite you to take a step towards your spiritual awakening</Text></View>
                <View style={{ paddingBottom: 20, gap: 16 }}></View>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}><View style={{ width: '48%' }}><BoardCard icon={<Icons.CardsIcon />} title='Card Shop' subtitle='Discover powers' />
                    <BoardCard icon={<Icons.Wave />} title='Energy Stream' subtitle="Connect flow" /></View>
                    <View style={{ width: '48%' }}><BoardCard icon={<Icons.Rate />} title='Track Progress' subtitle='Monitor growth' />
                        <BoardCard icon={<Icons.ProfileIcon />} title='Your Profile' subtitle='Personal space' /></View></View>


            </View>
            <Icons.DotsEnd style={{alignSelf:'center'}}/>
            <GradientButton
                iconLeft={<Icons.Question />}
                icon={<Icons.Right />}
                title="Start Journey"
                colors={['#4169E1', '#A855F7', '#FFD700']}
                locations={[0.3, 0.4, 0.9]}
                onClickButton={() => nav.navigate('Login')}
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
        paddingBottom:40
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
        fontSize: 36,
        textAlign: 'center',
        fontWeight: '700',
        lineHeight: 44,
        paddingTop: 28, paddingBottom: 16
    },
    subtitle: {
        color: '#9CA3AF',
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 23,
        textAlign: 'center',
        paddingBottom: 80
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
