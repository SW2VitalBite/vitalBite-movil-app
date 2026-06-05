import type { ImageSourcePropType } from 'react-native';

// Avatares fotográficos reutilizados del Design System de Figma (sección "Avatar").
// Descargados a assets/figma/avatars desde los componentes del UI Kit.
export const avatars = {
  emma: require('../../assets/figma/avatars/emma.png') as ImageSourcePropType,
  sarah: require('../../assets/figma/avatars/sarah.png') as ImageSourcePropType,
  megan: require('../../assets/figma/avatars/megan.png') as ImageSourcePropType,
  sophia: require('../../assets/figma/avatars/sophia.png') as ImageSourcePropType,
  david: require('../../assets/figma/avatars/david.png') as ImageSourcePropType,
  jacob: require('../../assets/figma/avatars/jacob.png') as ImageSourcePropType,
};

export type AvatarKey = keyof typeof avatars;

// Pool ordenado para asignar avatares a listas (pacientes, citas, etc.)
export const avatarPool: ImageSourcePropType[] = [
  avatars.sarah,
  avatars.megan,
  avatars.sophia,
  avatars.david,
  avatars.jacob,
  avatars.emma,
];

export const getAvatarByIndex = (index: number): ImageSourcePropType =>
  avatarPool[index % avatarPool.length];
