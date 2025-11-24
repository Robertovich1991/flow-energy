import React from 'react';
import {
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
    title: string;
    onClickButton?: () => void;
    icon?: React.ReactNode;
    buttonStyle?: ViewStyle;
    colors?: string[];
    locations?: number[];
    iconLeft?: React.ReactNode;
    textStyle?: TextStyle;
}

const GradientButton: React.FC<Props> = ({
    title,
    onClickButton,
    textStyle,
    buttonStyle,
    iconLeft,
    icon,
    colors = ['#419AF2', '#3945F0', '#503EE6'], // default gradient
    locations = [0, 0.56, 1], // default gradient stops
}) => {
    return (
        <TouchableOpacity
            style={[styles.blueButton, buttonStyle]}
            onPress={onClickButton}
            activeOpacity={0.8}>
            <LinearGradient
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                colors={colors}
                locations={locations}
                style={[styles.linearGradient, buttonStyle]}>
                <View />
                <View>{iconLeft}</View>

                <Text style={[styles.buttonTitle,textStyle]}>{title}</Text>
                <View>{icon}</View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    blueButton: {
        width: '100%',
        borderRadius: 16,
    },
    buttonTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
        paddingVertical: 20,
    },
    linearGradient: {

        borderRadius: 16,
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
});

export default GradientButton;
