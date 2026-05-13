import { useState } from 'react'
import {
  premiumCarpetTextureOptions,
  standardCarpetTextureOptions,
} from '../data/carpetOptions.js'
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

const seatingOptions = [
  { value: 'none', label: 'No Seating' },
  {
    value: 'plastic-side-chair',
    label: 'Plastic Side Chair',
    thumbnailPath: '/furniture/plastic_side_chair_thumbnail.jpg',
  },
  {
    value: 'plastic-folding-chair',
    label: 'Plastic Folding Chair',
    thumbnailPath: '/furniture/plastic_folding_chair_thumbnail.jpg',
  },
  {
    value: 'padded-side-chair',
    label: 'Padded Side Chair',
    thumbnailPath: '/furniture/padded_barstool_thumbnail.jpg',
  },
  {
    value: 'lager-barstool',
    label: 'Lager Barstool',
    thumbnailPath: '/furniture/lager_barstool_thumbnail.jpg',
  },
  {
    value: 'ale-barstool',
    label: 'Ale Barstool',
    thumbnailPath: '/furniture/ale_barstool_thumbnail.jpg',
  },
]

const seatingQuantityOptions = [
  { value: '1', label: '1 Chair' },
  { value: '2', label: '2 Chairs' },
]

const tableOptions = [
  { value: 'none', label: 'No Table' },
  {
    value: '6ft-30in',
    label: '6ft 30in Skirted Table',
    thumbnailPath: '/furniture/6ft_30in_skirted_table_thumbnail.jpg',
  },
  {
    value: '6ft-42in',
    label: '6ft 42in Skirted Table',
    thumbnailPath: '/furniture/6ft_42in_skirted_table_thumbnail.jpg',
  },
]

const barstoolTextureOptions = [
  {
    value: 'black',
    label: 'Black',
    color: '#111111',
  },
  {
    value: 'white',
    label: 'White',
    color: '#ffffff',
  },
]

function SegmentedControl({
  label,
  value,
  options,
  onChange,
  rowCount,
  columnsClass = '',
  isCategoryLabel = true,
}) {
  return (
    <div className="grid gap-2">
      <p className={`text-sm text-neutral-700 ${isCategoryLabel ? 'font-bold' : 'font-medium'}`}>
        {label}
      </p>
      <div className={`grid gap-2 ${columnsClass}`}>
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
              className={`h-9 cursor-pointer rounded-md border px-3 text-sm font-medium transition ${
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

function FurnitureCards({ label, value, options, onChange }) {
  return (
    <div className="grid gap-2">
      <p className="text-sm font-bold text-neutral-700">{label}</p>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => {
          const isSelected = value === option.value

          return (
            <button
              key={option.value}
              type="button"
              className={`cursor-pointer overflow-hidden rounded-md border text-center transition ${
                isSelected
                  ? 'border-neutral-950 bg-neutral-950 text-white ring-2 ring-neutral-950'
                  : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400'
              }`}
              onClick={() => onChange(option.value)}
            >
              <span className="flex h-14 items-center justify-center bg-white p-1">
                {option.thumbnailPath ? (
                  <img
                    src={option.thumbnailPath}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-xs font-semibold uppercase text-neutral-400">
                    None
                  </span>
                )}
              </span>
              <span className="block px-1.5 py-1.5 text-[11px] font-semibold leading-3">
                {option.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ColorSwatches({ label, value, options, onChange }) {
  return (
    <div className="grid gap-2">
      <p className="text-sm font-medium text-neutral-700">{label}</p>
      <div className="flex gap-2">
        {options.map((option) => {
          const isSelected = value === option.value

          return (
            <button
              key={option.value}
              type="button"
              title={option.label}
              aria-label={`${label}: ${option.label}`}
              className={`h-8 w-8 cursor-pointer rounded-md border shadow-sm transition ${
                option.value === 'white' ? 'border-neutral-300' : ''
              } ${
                isSelected
                  ? 'ring-2 ring-neutral-950'
                  : 'border-neutral-300 hover:border-neutral-600'
              }`}
              style={{ backgroundColor: option.color }}
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

function CollapsibleSection({ title, isOpen, onToggle, children }) {
  return (
    <section className="border-t border-neutral-200 pt-3">
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-between text-left text-sm font-semibold text-[#214670]"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        {title}
        <span className="text-lg leading-none text-neutral-500">{isOpen ? '-' : '+'}</span>
      </button>

      <div
        className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="min-h-0">
          <div className="mt-3 grid gap-3">{children}</div>
        </div>
      </div>
    </section>
  )
}

function PanelSubsection({ title, children }) {
  return (
    <div className="grid gap-2">
      <h2 className="text-sm font-bold text-neutral-700">{title}</h2>
      {children}
    </div>
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
              className={`min-h-16 cursor-pointer rounded-md border px-3 py-2 text-left transition ${
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

function TextureSwatches({ label, value, options, onChange, showLabel = true }) {
  return (
    <div className="grid gap-2">
      {showLabel && <p className="text-sm font-medium text-neutral-700">{label}</p>}
      <div className="grid grid-cols-8 gap-2">
        {options.map((option) => {
          const isSelected = value === option.value

          return (
            <button
              key={option.value}
              type="button"
              title={option.label}
              aria-label={`${label}: ${option.label}`}
              className={`h-8 cursor-pointer rounded-md border bg-cover bg-center shadow-sm transition ${
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
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const [openSections, setOpenSections] = useState({
    carpet: false,
    furniture: false,
    left: false,
    back: false,
    right: false,
  })

  function toggleSection(side) {
    setOpenSections((currentSections) => ({
      carpet: false,
      furniture: false,
      left: false,
      back: false,
      right: false,
      [side]: !currentSections[side],
    }))
  }

  return (
    <>
      {!isMobileDrawerOpen && (
        <button
          type="button"
          className="absolute bottom-4 right-4 z-10 cursor-pointer rounded-md bg-[#214670] px-4 py-3 text-sm font-semibold text-white shadow-lg md:hidden"
          onClick={() => setIsMobileDrawerOpen(true)}
        >
          Customize Booth
        </button>
      )}

      <aside
        className={`absolute inset-x-0 bottom-0 z-10 max-h-[78vh] overflow-y-auto rounded-t-lg border border-white/70 bg-white/[0.94] p-3 shadow-xl shadow-neutral-900/10 backdrop-blur md:inset-x-auto md:bottom-auto md:right-4 md:top-4 md:block md:max-h-[calc(100vh-2rem)] md:w-80 md:rounded-lg md:p-[17px] ${
          isMobileDrawerOpen ? 'block' : 'hidden'
        }`}
      >
      <div className="mb-4 flex items-start justify-between gap-3 text-center">
        <div className="min-w-0 flex-1">
        <img
          src="/images/SourceOne-Logo-RGB.svg"
          alt="SourceOne Events"
          className="mx-auto mb-3 h-9 w-auto"
        />
        <h1 className="text-base font-semibold text-neutral-950">Booth Configurator</h1>
        </div>
        <button
          type="button"
          className="cursor-pointer rounded-md border border-neutral-200 px-3 py-1.5 text-sm font-semibold text-neutral-700 md:hidden"
          onClick={() => setIsMobileDrawerOpen(false)}
        >
          Close
        </button>
      </div>

      <div className="grid gap-3">
        <CollapsibleSection
          title="Carpet & Flooring"
          isOpen={openSections.carpet}
          onToggle={() => toggleSection('carpet')}
        >
          <PanelSubsection title="Standard Carpet">
            <TextureSwatches
              label="Standard Carpet"
              value={config.carpet}
              options={standardCarpetTextureOptions}
              showLabel={false}
              onChange={onCarpetChange}
            />
          </PanelSubsection>

          <PanelSubsection title="Premium Carpet & Flooring">
            <TextureSwatches
              label="Premium Carpet & Flooring"
              value={config.carpet}
              options={premiumCarpetTextureOptions}
              showLabel={false}
              onChange={onCarpetChange}
            />
          </PanelSubsection>
        </CollapsibleSection>

        <CollapsibleSection
          title="Furniture"
          isOpen={openSections.furniture}
          onToggle={() => toggleSection('furniture')}
        >
          <FurnitureCards
            label="Seating"
            value={config.furniture.seating}
            options={seatingOptions}
            onChange={(value) => onFurnitureChange('seating', value)}
          />

          {config.furniture.seating !== 'none' && (
            <SegmentedControl
              label="Quantity"
              value={config.furniture.seatingQuantity}
              options={seatingQuantityOptions}
              columnsClass="grid-cols-2"
              isCategoryLabel={false}
              onChange={(value) => onFurnitureChange('seatingQuantity', value)}
            />
          )}

          {(config.furniture.seating === 'lager-barstool' ||
            config.furniture.seating === 'ale-barstool') && (
            <ColorSwatches
              label="Barstool Color"
              value={config.furniture.barstoolColor}
              options={barstoolTextureOptions}
              onChange={(value) => onFurnitureChange('barstoolColor', value)}
            />
          )}

          <FurnitureCards
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

          <SegmentedControl
            label="Trash Can"
            value={config.furniture.trashCan}
            options={trashCanOptions}
            columnsClass="grid-cols-2"
            onChange={(value) => onFurnitureChange('trashCan', value)}
          />
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
    </>
  )
}
