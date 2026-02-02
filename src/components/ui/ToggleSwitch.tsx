import { motion } from 'framer-motion'
import './ToggleSwitch.css'

export interface ToggleSwitchProps {
  value: boolean
  onChange: (value: boolean) => void
  leftLabel: string
  rightLabel: string
}

export default function ToggleSwitch({ value, onChange, leftLabel, rightLabel }: ToggleSwitchProps) {
  return (
    <div className="toggle-switch-container">
      <div className="toggle-switch-labels">
        <span className={`toggle-switch-label ${!value ? 'toggle-switch-label--active' : ''}`}>
          {leftLabel}
        </span>
      </div>
      
      <button
        type="button"
        className="toggle-switch"
        onClick={() => onChange(!value)}
        aria-label={value ? rightLabel : leftLabel}
        aria-pressed={value}
      >
        <motion.div
          className="toggle-switch-handle"
          animate={{
            x: value ? '1.75rem' : '0rem',
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 25,
          }}
        />
      </button>

      <div className="toggle-switch-labels">
        <span className={`toggle-switch-label ${value ? 'toggle-switch-label--active' : ''}`}>
          {rightLabel}
        </span>
      </div>
    </div>
  )
}
