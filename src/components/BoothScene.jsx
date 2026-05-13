import { Center, Environment, OrbitControls, useGLTF, useTexture } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useMemo } from 'react'
import { ClampToEdgeWrapping, RepeatWrapping, SRGBColorSpace } from 'three'
import { carpetTextureOptions, carpetTexturePreloadPaths } from '../data/carpetOptions.js'
import {
  drapeGroups,
  drapePanelNumbers,
  drapeTextureOptions,
  drapeTexturePreloadPaths,
} from '../data/drapeOptions.js'
import { skirtTextureOptions, skirtTexturePreloadPaths } from '../data/skirtOptions.js'

const MODEL_PATH = '/models/booth.glb'
const HDRI_PATH = '/hdri/paul_lobe_haus_4k.hdr'
const SHOW_GRID = true
const DRAPE_REPEAT = [4, 4]
const DEFAULT_BARSTOOL_COLOR = 'black'

const barstoolTextureOptions = [
  {
    value: 'black',
    label: 'Black',
    lagerTexturePath: '/textures/barstools/Lager_Barstool_Black.png',
    aleTexturePath: '/textures/barstools/Ale_Barstool_Black.png',
  },
  {
    value: 'white',
    label: 'White',
    lagerTexturePath: '/textures/barstools/Lager_Barstool_White.png',
    aleTexturePath: '/textures/barstools/Ale_Barstool_White.png',
  },
]

const barstoolTexturePreloadPaths = barstoolTextureOptions.flatMap((option) => [
  option.lagerTexturePath,
  option.aleTexturePath,
])

const seatingObjectGroups = {
  'plastic-side-chair': ['plastic_side_chair_left', 'plastic_side_chair_right'],
  'plastic-folding-chair': ['plastic_folding_chair_left', 'plastic_folding_chair_right'],
  'padded-side-chair': ['padded_side_chair_left', 'padded_side_chair_right'],
  'lager-barstool': [
    'lager_barstool_left_bottom',
    'lager_barstool_left_top',
    'lager_barstool_right_bottom',
    'lager_barstool_right_top',
  ],
  'ale-barstool': [
    'ale_bar_stool_left_top',
    'ale_bar_stool_left_bottom',
    'ale_bar_stool_right_bottom',
    'ale_bar_stool_right_top',
  ],
}

const tableObjectGroups = {
  '6ft-30in': ['skirt_30in', 'tabletop_30in'],
  '6ft-42in': ['skirt_42in', 'tabletop_42in'],
}

const texturePreloadPaths = [
  ...drapeTexturePreloadPaths,
  ...carpetTexturePreloadPaths,
  ...skirtTexturePreloadPaths,
  ...barstoolTexturePreloadPaths,
]

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
    </>
  )
}

function PlaceholderGround() {
  return (
    <gridHelper
      args={[12, 12, '#cbd5e1', '#e2e8f0']}
      position={[0, -.14, 0]}
    />
  )
}

function createOptionMap(options) {
  return new Map(options.map((option) => [option.value, option]))
}

function configureTexture(texture, shouldRepeat) {
  texture.colorSpace = SRGBColorSpace
  texture.flipY = false

  if (shouldRepeat) {
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(...DRAPE_REPEAT)
  } else {
    texture.wrapS = ClampToEdgeWrapping
    texture.wrapT = ClampToEdgeWrapping
    texture.repeat.set(1, 1)
  }

  texture.needsUpdate = true
}

function setMaterialTexture(materials, materialName, texture) {
  const material = materials[materialName]

  if (!material) {
    return
  }

  material.map = texture ?? null
  material.needsUpdate = true
}

function setObjectVisibility(scene, objectName, isVisible) {
  const object = scene.getObjectByName(objectName)

  if (object) {
    object.visible = isVisible
  }
}

function setObjectsVisibility(scene, objectNames, isVisible) {
  objectNames.forEach((objectName) => setObjectVisibility(scene, objectName, isVisible))
}

function tuneGalvanizedMaterial(materials) {
  const material = materials.MAT_galvanized

  if (!material) {
    return
  }

  material.color?.set('#c5cbd3')
  material.metalness = 0.8
  material.roughness = 0.24
  material.envMapIntensity = 1.8
  material.needsUpdate = true
}

function BoothModel({ config }) {
  const { scene, materials } = useGLTF(MODEL_PATH)
  const loadedTextures = useTexture(texturePreloadPaths)

  const textureByPath = useMemo(
    () => new Map(texturePreloadPaths.map((path, index) => [path, loadedTextures[index]])),
    [loadedTextures],
  )

  const drapeOptionsByValue = useMemo(() => createOptionMap(drapeTextureOptions), [])
  const carpetOptionsByValue = useMemo(() => createOptionMap(carpetTextureOptions), [])
  const skirtOptionsByValue = useMemo(() => createOptionMap(skirtTextureOptions), [])
  const barstoolOptionsByValue = useMemo(() => createOptionMap(barstoolTextureOptions), [])

  useEffect(() => {
    const selectedBarstoolOption =
      barstoolOptionsByValue.get(config.furniture.barstoolColor) ??
      barstoolOptionsByValue.get(DEFAULT_BARSTOOL_COLOR)

    const drapeMaterialSelections = drapeGroups.flatMap(({ side }) =>
      drapePanelNumbers.map((panelNumber, panelIndex) => ({
        materialName: `MAT_drape_${side}_${panelNumber}`,
        option: drapeOptionsByValue.get(config.drapes[side][panelIndex]),
        isDrapeTexture: true,
      })),
    )

    const materialSelections = [
      ...drapeMaterialSelections,
      {
        materialName: 'MAT_carpet',
        option: carpetOptionsByValue.get(config.carpet),
        shouldRepeat: false,
      },
      {
        materialName: 'MAT_6ft_30in_skirted_Table',
        option: skirtOptionsByValue.get(config.furniture.skirt),
        shouldRepeat: true,
      },
      {
        materialName: 'MAT_6ft_42in_skirted_Table',
        option: skirtOptionsByValue.get(config.furniture.skirt),
        shouldRepeat: true,
      },
      {
        materialName: 'MATT_Lager_Barstool',
        option: { texturePath: selectedBarstoolOption?.lagerTexturePath },
        shouldRepeat: false,
      },
      {
        materialName: 'MATT_Ale_barstool',
        option: { texturePath: selectedBarstoolOption?.aleTexturePath },
        shouldRepeat: false,
      },
    ]

    materialSelections.forEach(({ materialName, option, isDrapeTexture, shouldRepeat }) => {
      const texture = option?.texturePath ? textureByPath.get(option.texturePath) : null

      if (texture) {
        configureTexture(texture, shouldRepeat ?? isDrapeTexture)
      }

      setMaterialTexture(materials, materialName, texture)
    })

    tuneGalvanizedMaterial(materials)
  }, [
    barstoolOptionsByValue,
    carpetOptionsByValue,
    config,
    drapeOptionsByValue,
    materials,
    skirtOptionsByValue,
    textureByPath,
  ])

  useEffect(() => {
    setObjectVisibility(scene, 'trash_can', config.furniture.trashCan === 'visible')

    Object.entries(seatingObjectGroups).forEach(([seating, objectNames]) => {
      setObjectsVisibility(scene, objectNames, config.furniture.seating === seating)
    })

    Object.entries(tableObjectGroups).forEach(([table, objectNames]) => {
      setObjectsVisibility(scene, objectNames, config.furniture.table === table)
    })
  }, [config.furniture, scene])

  return (
    <Center position={[0, 1.1, 0]}>
      <primitive object={scene} />
    </Center>
  )
}

export default function BoothScene({ config }) {
  return (
    <Canvas
      camera={{ position: [1.1, 1.55, 8.2], fov: 36 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => gl.setClearAlpha(0)}
    >
      <SceneLights />
      <Suspense fallback={null}>
        <Environment files={HDRI_PATH} environmentIntensity={1.15} />
        <BoothModel config={config} />
      </Suspense>
      {SHOW_GRID && <PlaceholderGround />}
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={5.8}
        maxDistance={11}
        target={[0, 0.7, 0]}
      />
    </Canvas>
  )
}

useGLTF.preload(MODEL_PATH)
texturePreloadPaths.forEach((path) => useTexture.preload(path))
