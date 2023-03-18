import { useEffect, useState } from 'react'

interface useStickyProps {
  offset: number
  window: any
}
/**  Method that will fix header after a specific scrollable
  @param {number} offset - The offset from the top of the page
  **/

export const useSticky = ({ offset }: useStickyProps) => {
  const [isSticky, setIsSticky] = useState(false)

  const checkWindow = () => {
    const scrollTop = window.scrollY
    scrollTop >= offset ? setIsSticky(true) : setIsSticky(false)
  }

  useEffect(() => {
    window.addEventListener('scroll', checkWindow)
    return () => {
      window.removeEventListener('scroll', checkWindow)
    }
  })

  return { isSticky }
}
