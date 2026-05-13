export const drapeGroups = [
  { side: 'left', label: 'Left Drapes' },
  { side: 'back', label: 'Back Drapes' },
  { side: 'right', label: 'Right Drapes' },
]

export const drapePanelNumbers = [1, 2, 3, 4]

export const drapeTextureOptions = [
  {
    value: 'black',
    label: 'Black',
    texturePath: '/textures/drapes/drape_black.jpg',
  },
  {
    value: 'beige',
    label: 'Beige',
    texturePath: '/textures/drapes/drape_beige.jpg',
  },
  {
    value: 'burgundy',
    label: 'Burgundy',
    texturePath: '/textures/drapes/drape_burgundy.jpg',
  },
  {
    value: 'charcoal',
    label: 'Charcoal',
    texturePath: '/textures/drapes/drape_charcoal.jpg',
  },
  {
    value: 'dark-plum',
    label: 'Dark Plum',
    texturePath: '/textures/drapes/drape_dark_plum.jpg',
  },
  {
    value: 'gold',
    label: 'Gold',
    texturePath: '/textures/drapes/drape_gold.jpg',
  },
  {
    value: 'navy',
    label: 'Navy',
    texturePath: '/textures/drapes/drape_navy.jpg',
  },
  {
    value: 'plum',
    label: 'Plum',
    texturePath: '/textures/drapes/drape_plum.jpg',
  },
  {
    value: 'purple',
    label: 'Purple',
    texturePath: '/textures/drapes/drape_purple.jpg',
  },
  {
    value: 'red',
    label: 'Red',
    texturePath: '/textures/drapes/drape_red.jpg',
  },
  {
    value: 'royal-blue',
    label: 'Royal Blue',
    texturePath: '/textures/drapes/drape_royal_blue.jpg',
  },
  {
    value: 'royal-green',
    label: 'Royal Green',
    texturePath: '/textures/drapes/drape_royal_green.jpg',
  },
  {
    value: 'silver',
    label: 'Silver',
    texturePath: '/textures/drapes/drape_silver.jpg',
  },
  {
    value: 'teal',
    label: 'Teal',
    texturePath: '/textures/drapes/drape_teal.jpg',
  },
  {
    value: 'velour',
    label: 'Velour',
    texturePath: '/textures/drapes/drape_velour.jpg',
  },
  {
    value: 'white',
    label: 'White',
    texturePath: '/textures/drapes/drape_white.jpg',
  },
]

export const drapeTexturePreloadPaths = drapeTextureOptions.map(
  (option) => option.texturePath,
)
