export const standardCarpetTextureOptions = [
  {
    value: 'black',
    label: 'Black',
    texturePath: '/textures/carpet/Black_carpet.jpg',
  },
  {
    value: 'crimson',
    label: 'Crimson',
    texturePath: '/textures/carpet/Crimson_Carpet.jpg',
  },
  {
    value: 'eclipse',
    label: 'Eclipse',
    texturePath: '/textures/carpet/Eclipse_Carpet.jpg',
  },
  {
    value: 'electrical-blue',
    label: 'Electrical Blue',
    texturePath: '/textures/carpet/Electrical_Blue_Carpet.jpg',
  },
  {
    value: 'silver-dollar',
    label: 'Silver Dollar',
    texturePath: '/textures/carpet/Silver_Dollar_Capret.jpg',
  },
  {
    value: 'teal',
    label: 'Teal',
    texturePath: '/textures/carpet/Teal_Carpet.jpg',
  },
  {
    value: 'tuxedo',
    label: 'Tuxedo',
    texturePath: '/textures/carpet/Tuxedo_Carpet.jpg',
  },
]

export const premiumCarpetTextureOptions = [
  {
    value: 'premium-blueberry',
    label: 'Blueberry Carpet',
    texturePath: '/textures/carpet/Premium_Blueberry_Carpet.jpg',
  },
  {
    value: 'premium-burgundy',
    label: 'Burgundy Carpet',
    texturePath: '/textures/carpet/Premium_Burgundy_Carpet.jpg',
  },
  {
    value: 'premium-dark-purple',
    label: 'Dark Purple Carpet',
    texturePath: '/textures/carpet/Premium_Dark_Purple_Carpet.jpg',
  },
  {
    value: 'premium-emerald',
    label: 'Emerald Carpet',
    texturePath: '/textures/carpet/Premium_Emerald_Carpet.jpg',
  },
  {
    value: 'premium-paprika',
    label: 'Paprika Carpet',
    texturePath: '/textures/carpet/Premium_Paprika_Carpet.jpg',
  },
  {
    value: 'premium-pure-white',
    label: 'Pure White Carpet',
    texturePath: '/textures/carpet/Premium_Pure_White_Carpet.jpg',
  },
  {
    value: 'premium-sand',
    label: 'Sand Carpet',
    texturePath: '/textures/carpet/Premium_Sand_Carpet.jpg',
  },
  {
    value: 'premium-wintergreen',
    label: 'Wintergreen Carpet',
    texturePath: '/textures/carpet/Premium_Wintergreen_Carpet.jpg',
  },
  {
    value: 'premium-walnut-flooring',
    label: 'Walnut Flooring',
    texturePath: '/textures/carpet/Premium_Walnut_Flooring.jpg',
  },
  {
    value: 'premium-weathered-flooring',
    label: 'Weathered Flooring',
    texturePath: '/textures/carpet/Premium_Weathered_Flooring.jpg',
  },
]

export const carpetTextureOptions = [
  ...standardCarpetTextureOptions,
  ...premiumCarpetTextureOptions,
]

export const carpetTexturePreloadPaths = carpetTextureOptions
  .map((option) => option.texturePath)
  .filter(Boolean)
