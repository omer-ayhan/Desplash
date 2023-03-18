import { RefObject, useEffect, useRef, useState } from 'react'

interface useDetectOutsideProps<TRef> {
  ref: RefObject<TRef>
  cb?: () => void
}

export function useDetectOutside<LRef>({
  ref,
  cb,
}: useDetectOutsideProps<LRef>) {
  const handleOutsideClick = (event: DocumentEventMap['click']) => {
    if (ref.current && !(ref.current as any).contains(event.target)) {
      cb?.()
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [ref])

  return
}
