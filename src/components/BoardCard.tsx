import React from 'react';
import { ImageBackground, View, StyleSheet, StatusBar, Platform, Text } from 'react-native';

interface Props {
    icon: React.ReactNode;
    title?: string;
    subtitle?: string;
}

export default function BoardCard({ icon, title, subtitle }: Props) {
    return (
        <View style={{marginBottom:12, width:"100%",justifyContent:'center',alignItems:'center', gap: 16, backgroundColor: 'rgba(26, 31, 51, 0.6)', padding: 21, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 16 }}>
            {icon}
            <View><Text style={{ fontSize: 16, fontWeight: '600', color: '#fff',textAlign:'center' }}>{title}</Text>
                <Text style={{ color: '#9CA3AF', fontSize: 14, fontWeight: '400',textAlign:'center', lineHeight: 23 }}>{subtitle}</Text></View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        paddingTop: 0,
        backgroundColor: 'rgba(26, 31, 51, 0.6)',
    },
    image: {
        opacity: 0.8,
    },
    content: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 20 : 10,
    },
});
