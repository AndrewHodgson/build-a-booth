import { useProgress } from '@react-three/drei'
import { useState } from 'react'
import BoothScene from './components/BoothScene.jsx'
import ConfigPanel from './components/ConfigPanel.jsx'
import { drapeGroups, drapePanelNumbers } from './data/drapeOptions.js'

const DEFAULT_DRAPE = 'black'
const DEFAULT_DRAPE_LAYOUT = {
  pattern: 'solid',
  colorA: 'black',
  colorB: 'white',
}

const drapePatterns = {
  solid: ({ colorA }) => [colorA, colorA, colorA, colorA],
  alternating: ({ colorA, colorB }) => [colorA, colorB, colorA, colorB],
  centerHighlight: ({ colorA, colorB }) => [colorA, colorB, colorB, colorA],
  outerHighlight: ({ colorA, colorB }) => [colorB, colorA, colorA, colorB],
}

function createDefaultDrapes() {
  return Object.fromEntries(
    drapeGroups.map(({ side }) => [
      side,
      drapePanelNumbers.map(() => DEFAULT_DRAPE),
    ]),
  )
}

function createDefaultDrapeLayouts() {
  return Object.fromEntries(
    drapeGroups.map(({ side }) => [side, { ...DEFAULT_DRAPE_LAYOUT }]),
  )
}

function applyPattern(layout) {
  return drapePatterns[layout.pattern]?.(layout) ?? null
}

function LoadingOverlay() {
  const { active, progress } = useProgress()
  const isVisible = active || progress < 100
  const roundedProgress = Math.round(progress)

  if (!isVisible) {
    return null
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="w-56">
        <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200">
          <div
            className="h-full rounded-full transition-[width]"
            style={{
              width: `${roundedProgress}%`,
              backgroundColor: '#214670',
            }}
          />
        </div>
        <p className="mt-3 text-center text-xs font-medium text-neutral-600">
          Loading {roundedProgress}%
        </p>
      </div>
    </div>
  )
}

const initialConfig = {
  carpet: 'silver-dollar',
  drapes: createDefaultDrapes(),
  drapeLayouts: createDefaultDrapeLayouts(),
  furniture: {
    trashCan: 'visible',
    seating: 'plastic-folding-chair',
    seatingQuantity: '2',
    table: '6ft-30in',
    skirt: 'black',
    barstoolColor: 'black',
  },
}

export default function App() {
  const [config, setConfig] = useState(initialConfig)

  function updateCarpet(value) {
    setConfig((currentConfig) => ({
      ...currentConfig,
      carpet: value,
    }))
  }

  function updateDrapePanel(side, panelIndex, value) {
    setConfig((currentConfig) => ({
      ...currentConfig,
      drapeLayouts: {
        ...currentConfig.drapeLayouts,
        [side]: {
          ...currentConfig.drapeLayouts[side],
          pattern: 'custom',
        },
      },
      drapes: {
        ...currentConfig.drapes,
        [side]: currentConfig.drapes[side].map((currentValue, index) =>
          index === panelIndex ? value : currentValue,
        ),
      },
    }))
  }

  function updateDrapeLayout(side, updates) {
    setConfig((currentConfig) => ({
      ...currentConfig,
      drapeLayouts: {
        ...currentConfig.drapeLayouts,
        [side]: {
          ...currentConfig.drapeLayouts[side],
          ...updates,
        },
      },
      drapes: (() => {
        const nextLayout = {
          ...currentConfig.drapeLayouts[side],
          ...updates,
        }
        const nextPanels = applyPattern(nextLayout)

        if (!nextPanels) {
          return currentConfig.drapes
        }

        return {
          ...currentConfig.drapes,
          [side]: nextPanels,
        }
      })(),
    }))
  }

  function updateFurniture(key, value) {
    setConfig((currentConfig) => ({
      ...currentConfig,
      furniture: {
        ...currentConfig.furniture,
        [key]: value,
      },
    }))
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[radial-gradient(ellipse_at_50%_18%,#ffffff_0%,#eef1f5_42%,#d8dde5_72%,#c4cad4_100%)]">
      <section className="absolute inset-0" aria-label="3D booth preview">
        <BoothScene config={config} />
      </section>

      <LoadingOverlay />

      <div className="pointer-events-none absolute bottom-4 left-4 z-10 hidden rounded-md bg-white/70 px-3 py-2 text-xs leading-5 text-neutral-600 shadow-sm backdrop-blur md:block">
        <p>Left click + drag: orbit / rotate</p>
        <p>Scroll wheel: zoom in / out</p>
      </div>

      <ConfigPanel
        config={config}
        onCarpetChange={updateCarpet}
        onDrapeChange={updateDrapePanel}
        onDrapeLayoutChange={updateDrapeLayout}
        onFurnitureChange={updateFurniture}
      />
    </main>
  )
}
