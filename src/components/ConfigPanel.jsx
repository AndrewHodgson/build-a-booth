import { useState } from 'react'
import { carpetTextureOptions } from '../data/carpetOptions.js'
import { drapeGroups, drapeTextureOptions } from '../data/drapeOptions.js'
import { skirtTextureOptions } from '../data/skirtOptions.js'

const layoutPatterns = [
  { value: 'solid', label: 'Solid' },
  { value: 'alternating', label: 'Alternating', sample: ['A', 'B', 'A', 'B'] },
  { value: 'centerHighlight', label: 'Center Highlight', sample: ['A', 'B', 'B', 'A'] },
  { value: 'outerHighlight', label: 'Outer Highlight', sample: ['B', 'A', 'A', 'B'] },
  { value: 'custom', label: 'Custom' },
]

const trashCanOptions = [
  { value: 'visible', label: 'Visible' },
  { value: 'hidden', label: 'Hidden' },
]

const chairOptions = [
  { value: '2', label: '2 Chairs' },
  { value: '1', label: '1 Chair' },
  { value: '0', label: 'No Chairs' },
]

const tableOptions = [
  { value: '6ft-30in', label: '6ft 30in Table' },
  { value: '6ft-42in', label: '6ft 42in Table' },
  { value: 'none', label: 'No Table' },
]

function SegmentedControl({ label, value, options, onChange, rowCount }) {
  return (
    <div className="grid gap-2">
      <p className="text-sm font-medium text-neutral-700">{label}</p>
      <div className="grid gap-2">
        {Array.from({ length: rowCount ?? options.length }).map((_, index) => {
          const option = options[index]

          if (!option) {
            return <span key={`empty-${index}`} className="h-9" aria-hidden="true" />
          }

          const isSelected = value === option.value

          return (
            <button
              key={option.value}
              type="button"
              className={`h-9 rounded-md border px-3 text-sm font-medium transition ${
                isSelected
                  ? 'border-neutral-950 bg-neutral-950 text-white'
                  : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
              }`}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function CollapsibleSection({ title, isOpen, onToggle, children }) {
  return (
    <section className="border-t border-neutral-200 pt-3">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left text-sm font-semibold text-neutral-950"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        {title}
        <span className="text-lg leading-none text-neutral-500">{isOpen ? '-' : '+'}</span>
      </button>

      {isOpen && <div className="mt-3 grid gap-3">{children}</div>}
    </section>
  )
}

function PatternPreview({ pattern }) {
  const sample = pattern.sample ?? ['A', 'A', 'A', 'A']

  if (pattern.value === 'custom') {
    return <span className="text-[11px] font-medium text-neutral-500">Edit panels</span>
  }

  return (
    <span className="flex gap-1">
      {sample.map((item, index) => (
        <span
          key={`${pattern.value}-${index}`}
          className={`h-3 w-5 rounded-sm ${item === 'A' ? 'bg-neutral-900' : 'bg-neutral-300'}`}
        />
      ))}
    </span>
  )
}

function PatternButtons({ value, onChange }) {
  return (
    <div className="grid gap-2">
      <p className="text-sm font-medium text-neutral-700">Drape layout pattern</p>
      <div className="grid grid-cols-2 gap-2">
        {layoutPatterns.map((pattern) => {
          const isSelected = value === pattern.value

          return (
            <button
              key={pattern.value}
              type="button"
              className={`min-h-16 rounded-md border px-3 py-2 text-left transition ${
                isSelected
                  ? 'border-neutral-900 bg-neutral-950 text-white'
                  : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400'
              }`}
              onClick={() => onChange(pattern.value)}
            >
              <span className="block text-xs font-semibold">{pattern.label}</span>
              <span className="mt-2 block">
                <PatternPreview pattern={pattern} />
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function TextureSwatches({ label, value, options, onChange }) {
  return (
    <div className="grid gap-2">
      <p className="text-sm font-medium text-neutral-700">{label}</p>
      <div className="grid grid-cols-8 gap-2">
        {options.map((option) => {
          const isSelected = value === option.value

          return (
            <button
              key={option.value}
              type="button"
              title={option.label}
              aria-label={`${label}: ${option.label}`}
              className={`h-8 rounded-md border bg-cover bg-center shadow-sm transition ${
                isSelected
                  ? 'border-neutral-950 ring-2 ring-neutral-950'
                  : 'border-neutral-300 hover:border-neutral-600'
              }`}
              style={{ backgroundImage: `url(${option.texturePath})` }}
              onClick={() => onChange(option.value)}
            />
          )
        })}
      </div>
      <p className="text-xs text-neutral-500">
        {options.find((option) => option.value === value)?.label}
      </p>
    </div>
  )
}

function DrapeSection({
  group,
  config,
  isOpen,
  onToggle,
  onDrapeChange,
  onDrapeLayoutChange,
}) {
  const layout = config.drapeLayouts[group.side]

  return (
    <CollapsibleSection title={group.label} isOpen={isOpen} onToggle={onToggle}>
      <PatternButtons
        value={layout.pattern}
        onChange={(pattern) => onDrapeLayoutChange(group.side, { pattern })}
      />

      {layout.pattern !== 'custom' && (
        <div className="grid gap-3">
          <TextureSwatches
            label="Color A"
            value={layout.colorA}
            options={drapeTextureOptions}
            onChange={(colorA) => onDrapeLayoutChange(group.side, { colorA })}
          />
          <TextureSwatches
            label="Color B"
            value={layout.colorB}
            options={drapeTextureOptions}
            onChange={(colorB) => onDrapeLayoutChange(group.side, { colorB })}
          />
        </div>
      )}

      {layout.pattern === 'custom' && (
        <div className="grid gap-3">
          {config.drapes[group.side].map((value, panelIndex) => (
            <TextureSwatches
              key={`${group.side}-${panelIndex}`}
              label={`Panel ${panelIndex + 1}`}
              value={value}
              options={drapeTextureOptions}
              onChange={(nextValue) =>
                onDrapeChange(group.side, panelIndex, nextValue)
              }
            />
          ))}
        </div>
      )}
    </CollapsibleSection>
  )
}

export default function ConfigPanel({
  config,
  onCarpetChange,
  onDrapeChange,
  onDrapeLayoutChange,
  onFurnitureChange,
}) {
  const [openSections, setOpenSections] = useState({
    carpet: true,
    furniture: false,
    left: false,
    back: false,
    right: false,
  })

  function toggleSection(side) {
    setOpenSections((currentSections) => ({
      ...currentSections,
      [side]: !currentSections[side],
    }))
  }

  return (
    <aside className="absolute inset-x-3 bottom-3 z-10 max-h-[calc(100vh-1.5rem)] overflow-y-auto rounded-lg border border-white/70 bg-white/[0.92] p-3 shadow-xl shadow-neutral-900/10 backdrop-blur md:inset-x-auto md:bottom-auto md:right-4 md:top-4 md:w-80">
      <div className="mb-4 text-center">
        <img
          src="/images/SourceOne-Logo-RGB.svg"
          alt="SourceOne Events"
          className="mx-auto mb-3 h-9 w-auto"
        />
        <h1 className="text-base font-semibold text-neutral-950">Booth Configurator</h1>
      </div>

      <div className="grid gap-3">
        <CollapsibleSection
          title="Carpet"
          isOpen={openSections.carpet}
          onToggle={() => toggleSection('carpet')}
        >
          <TextureSwatches
            label="Carpet"
            value={config.carpet}
            options={carpetTextureOptions}
            onChange={onCarpetChange}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="Furniture"
          isOpen={openSections.furniture}
          onToggle={() => toggleSection('furniture')}
        >
          <div className="grid grid-cols-2 gap-3">
            <SegmentedControl
              label="Trash Can"
              value={config.furniture.trashCan}
              options={trashCanOptions}
              rowCount={chairOptions.length}
              onChange={(value) => onFurnitureChange('trashCan', value)}
            />

            <SegmentedControl
              label="Chairs"
              value={config.furniture.chairs}
              options={chairOptions}
              onChange={(value) => onFurnitureChange('chairs', value)}
            />
          </div>

          <SegmentedControl
            label="Table"
            value={config.furniture.table}
            options={tableOptions}
            onChange={(value) => onFurnitureChange('table', value)}
          />

          {config.furniture.table !== 'none' && (
            <TextureSwatches
              label="Skirt Color"
              value={config.furniture.skirt}
              options={skirtTextureOptions}
              onChange={(value) => onFurnitureChange('skirt', value)}
            />
          )}
        </CollapsibleSection>

        {drapeGroups.map((group) => (
          <DrapeSection
            key={group.side}
            group={group}
            config={config}
            isOpen={openSections[group.side]}
            onToggle={() => toggleSection(group.side)}
            onDrapeChange={onDrapeChange}
            onDrapeLayoutChange={onDrapeLayoutChange}
          />
        ))}
      </div>
    </aside>
  )
}
