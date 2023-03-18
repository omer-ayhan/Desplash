import { useCallback, useState } from 'react'

export const useDisclosure = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState)

  const close = () => setIsOpen(false)
  const open = () => setIsOpen(true)
  const toggle = () => setIsOpen((prev) => !prev)

  return { isOpen, close, open, toggle }
}
