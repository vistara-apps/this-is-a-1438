import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const AccordionItem = ({ title, children, isOpen, onToggle, variant = 'default' }) => {
  const baseClasses = "border rounded-md transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]"
  const variantClasses = {
    default: "border-gray-200 bg-white hover:border-gray-300",
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]}`}>
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-150 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-gray-900">{title}</span>
        <div className="ml-2 flex-shrink-0">
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </div>
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-3 pt-1 text-gray-700 border-t border-gray-100">
          {children}
        </div>
      </div>
    </div>
  )
}

const Accordion = ({ 
  items = [], 
  allowMultiple = false, 
  defaultOpenItems = [], 
  variant = 'default',
  className = '' 
}) => {
  const [openItems, setOpenItems] = useState(new Set(defaultOpenItems))

  const toggleItem = (index) => {
    setOpenItems(prev => {
      const newOpenItems = new Set(prev)
      
      if (newOpenItems.has(index)) {
        newOpenItems.delete(index)
      } else {
        if (!allowMultiple) {
          newOpenItems.clear()
        }
        newOpenItems.add(index)
      }
      
      return newOpenItems
    })
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, index) => (
        <AccordionItem
          key={item.id || index}
          title={item.title}
          isOpen={openItems.has(index)}
          onToggle={() => toggleItem(index)}
          variant={variant}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  )
}

// Hook for programmatic control
export const useAccordion = (initialOpenItems = []) => {
  const [openItems, setOpenItems] = useState(new Set(initialOpenItems))

  const toggleItem = (index, allowMultiple = false) => {
    setOpenItems(prev => {
      const newOpenItems = new Set(prev)
      
      if (newOpenItems.has(index)) {
        newOpenItems.delete(index)
      } else {
        if (!allowMultiple) {
          newOpenItems.clear()
        }
        newOpenItems.add(index)
      }
      
      return newOpenItems
    })
  }

  const openItem = (index, allowMultiple = false) => {
    setOpenItems(prev => {
      const newOpenItems = allowMultiple ? new Set(prev) : new Set()
      newOpenItems.add(index)
      return newOpenItems
    })
  }

  const closeItem = (index) => {
    setOpenItems(prev => {
      const newOpenItems = new Set(prev)
      newOpenItems.delete(index)
      return newOpenItems
    })
  }

  const closeAll = () => {
    setOpenItems(new Set())
  }

  const openAll = (itemCount) => {
    setOpenItems(new Set(Array.from({ length: itemCount }, (_, i) => i)))
  }

  return {
    openItems,
    toggleItem,
    openItem,
    closeItem,
    closeAll,
    openAll,
    isOpen: (index) => openItems.has(index)
  }
}

export default Accordion
