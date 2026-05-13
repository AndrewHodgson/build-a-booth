import { Center, Environment, OrbitControls, useGLTF, useTexture } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
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

const texturePreloadPaths = [
  ...drapeTexturePreloadPaths,
  ...carpetTexturePreloadPaths,
  ...skirtTexturePreloadPaths,
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
      position={[0, -.12, 0]}
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

  useEffect(() => {
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
    ]

    if (config.furniture.table !== 'none') {
      materialSelections.push({
        materialName:
          config.furniture.table === '6ft-30in'
            ? 'MAT_6ft_30in_skirted_Table'
            : 'MAT_6ft_42in_skirted_Table',
        option: skirtOptionsByValue.get(config.furniture.skirt),
        shouldRepeat: true,
      })
    }

    materialSelections.forEach(({ materialName, option, isDrapeTexture, shouldRepeat }) => {
      const texture = option?.texturePath ? textureByPath.get(option.texturePath) : null

      if (texture) {
        configureTexture(texture, shouldRepeat ?? isDrapeTexture)
      }

      setMaterialTexture(materials, materialName, texture)
    })

    tuneGalvanizedMaterial(materials)
  }, [
    carpetOptionsByValue,
    config,
    drapeOptionsByValue,
    materials,
    skirtOptionsByValue,
    textureByPath,
  ])

  useEffect(() => {
    setObjectVisibility(scene, 'trash_can', config.furniture.trashCan === 'visible')
    setObjectVisibility(scene, 'chair_1', config.furniture.chairs === '1' || config.furniture.chairs === '2')
    setObjectVisibility(scene, 'chair_2', config.furniture.chairs === '2')
    setObjectsVisibility(
      scene,
      ['table_6ft_30in', 'skirt_30in', 'tabletop_30in'],
      config.furniture.table === '6ft-30in',
    )
    setObjectsVisibility(
      scene,
      ['table_6ft_42in', 'skirt_42in', 'tabletop_42in'],
      config.furniture.table === '6ft-42in',
    )
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
      <Environment files={HDRI_PATH} environmentIntensity={1.15} />
      <BoothModel config={config} />
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
