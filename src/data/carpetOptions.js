export const carpetTextureOptions = [
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

export const carpetTexturePreloadPaths = carpetTextureOptions
  .map((option) => option.texturePath)
  .filter(Boolean)
