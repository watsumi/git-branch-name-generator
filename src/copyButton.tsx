import { useCallback, useState, useEffect } from 'react'

export const CopyButtonView = ({ onClick, isCopied = false }: { onClick: any; isCopied: boolean }) => {
  return (
    <button type="button" className="copy-button" onClick={onClick}>
      {isCopied ? 'Copied 🎉' : 'Copy'}
    </button>
  )
}

export const CopyButton = ({ onClick: onClickProp }: { onClick: any }) => {
  const [isCopied, setCopied] = useState(false)

  const onClick = useCallback(() => {
    setCopied(true)
    onClickProp()
  }, [onClickProp])

  useEffect(() => {
    let timer: number
    if (isCopied) {
      timer = setTimeout(() => {
        setCopied(false)
      }, 3000)
    }
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [isCopied])

  return <CopyButtonView onClick={onClick} isCopied={isCopied} />
}
