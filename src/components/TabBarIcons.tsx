import React from 'react';
import { theme } from '../theme';
import { Icons } from '../assets/images/svg';

interface TabIconProps {
  focused: boolean;
  size?: number;
}

export const HomeIcon: React.FC<TabIconProps> = ({ focused, size = 20 }) => {
  const color = focused ? theme.colors.primary : '#145ea7ff';
  
  return (
   <Icons.Home width={size} height={size} fill={color}/>
  );
};

export const CardsIcon: React.FC<TabIconProps> = ({ focused, size = 20 }) => {
  const color = focused ? theme.colors.primary : '#9AA0A6';
  
  return (
   <Icons.Cards width={size} height={size} fill={color}/>
  );
};

export const StreamsIcon: React.FC<TabIconProps> = ({ focused, size = 20 }) => {
  const color = focused ? theme.colors.primary : '#9AA0A6';
  
  return (
    <Icons.Tornado width={size} height={size} fill={color}/>
  );
};

export const ProfileIcon: React.FC<TabIconProps> = ({ focused, size = 20 }) => {
  const color = focused ? theme.colors.primary : '#9AA0A6';
  
  return (
  <Icons.Profile width={size} height={size} fill={color}/>
  );
};

