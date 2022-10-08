import { useCallback, useState, useEffect } from 'react'

export const CopyButtonView = ({ onClick, isCopied = false }) => {
  return (
    <button type="button" className="copy-button" onClick={onClick}>
      {isCopied ? 'Copied 🎉' : 'Copy'}
    </button>
  )
}

export const CopyButton = ({ onClick: onClickProp }) => {
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
