import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import './App.css'
import { CopyButton } from './copyButton'

type FormData = {
  code: string
  text: string
}

const pageErrorMessage = 'This page is not a GitHub issue page.'
const translateAPI = 'https://script.google.com/macros/s/AKfycbzeFS9_2YLoAwDV8MMvJel4mRwzaii7O2MHZqDJl2pOguCFy0E/exec'
const languages = [
  {
    id: 1,
    title: 'English',
    value: 'en'
  },
  {
    id: 2,
    title: 'Japanese',
    value: 'ja'
  }
]
const styles = [
  {
    id: 1,
    title: 'snake_case',
    value: '_'
  },
  {
    id: 2,
    title: 'kebab-case',
    value: '-'
  }
]

const getTranslatedTitle = (title: string, lang: string) => {
  return axios.get<FormData>(`${translateAPI}?text=${title}&source=${lang}&target=en`)
}

const getIssueNum = (url: string): string => {
  try {
    const urlObj = new URL(url)
    if (urlObj.hostname === 'github.com') {
      const issueIndex = urlObj.pathname.split('/').indexOf('issues') + 1
      return urlObj.pathname.split('/')[issueIndex]
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
  return ''
}

const setTitleFromResponse = (data: FormData): string => {
  if (data.code == '200') {
    return data.text
  }
  return ''
}

const formatTitle = (title: string, style: string): string => {
  try {
    const titleArray = title.split(' · ')
    if (titleArray[1].match(/^Issue.*/)) {
      return formatedTitle(titleArray[0], style)
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
  return pageErrorMessage
}

const formatedTitle = (title: string, style: string): string => {
  return title
    .replaceAll(/['.,?/\\@~^:;&%$*()\s]/g, style)
    .replaceAll('[', style)
    .replaceAll(']', style)
    .replaceAll(/-+/g, style)
    .replaceAll(/_+/g, style)
    .replaceAll(/^-/g, '')
    .replaceAll(/^_/g, '')
}

const generateBranchName = (prefix: string, issueNum: string, branchName: string, style: string): string => {
  try {
    const downCasedTitle = formatedTitle(branchName, style).toLowerCase()
    if (prefix && issueNum) {
      return `${prefix}/#${issueNum}${style}${downCasedTitle}`
    } else if (prefix) {
      return `${prefix}/${downCasedTitle}`
    } else if (issueNum) {
      return `${issueNum}${style}${downCasedTitle}`
    } else {
      return downCasedTitle
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
  return ''
}

function App() {
  const [prefix, setPrefix] = useState('')
  const [issueNum, setIssueNum] = useState('')
  const [title, setTitle] = useState('')
  const [branchName, setBranchName] = useState('')
  const [lang, setLang] = useState('en')
  const [style, setStyle] = useState('_')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(!loading)
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentURL = tabs[0].url || ''
      const currentTitle = tabs[0].title || ''
      const currentIssueNum = getIssueNum(currentURL)
      const downCasedTitle = formatTitle(currentTitle, style)
      setIssueNum(currentIssueNum)
      setTitle(downCasedTitle)
    })
    setLoading(loading)
  }, [style, loading])

  useEffect(() => {
    setLoading(!loading)
    const fetch = async () => {
      const translatedTitleData = await getTranslatedTitle(title, lang)
      const translatedTitle = setTitleFromResponse(translatedTitleData.data)
      setTitle(translatedTitle)
    }
    if (lang !== '' && lang !== 'en') {
      fetch()
    }
    setLoading(loading)
  }, [title, lang, loading])

  const onCopyClick = useCallback(() => {
    navigator.clipboard.writeText(branchName)
  }, [branchName])

  if (loading) return <h3>Loading...</h3>
  if (title !== '' && title !== pageErrorMessage) {
    return (
      <div className="App">
        <div className="container">
          <div className="row">
            <h3 className="current-title">{title}</h3>
          </div>
          <div className="row">
            <label>Translate from</label>
            <select onChange={(event) => setLang(event.target.value)}>
              {languages.map((language) => (
                <option key={language.id} value={language.value}>
                  {language.title}
                </option>
              ))}
            </select>
          </div>
          <div className="row">
            <label className="px-6">Issue#</label>
            <input value={issueNum} onChange={(event) => setIssueNum(event.target.value)} type="text" />
          </div>
          <div className="row">
            <label className="px-6">Prefix</label>
            <input value={prefix} onChange={(event) => setPrefix(event.target.value)} type="text" />
          </div>
          <div className="row">
            <label>Style</label>
            <select onChange={(event) => setStyle(event.target.value)}>
              {styles.map((style) => (
                <option key={style.id} value={style.value}>
                  {style.title}
                </option>
              ))}
            </select>
          </div>
          <div className="row">
            <button
              className="generate-button"
              onClick={() => setBranchName(generateBranchName(prefix, issueNum, title, style))}
            >
              Generate
            </button>
          </div>
          <div className="row">
            <h3 className="generated-title">{branchName ? branchName : 'Loading...'}</h3>
            <CopyButton onClick={onCopyClick} />
          </div>
        </div>
      </div>
    )
  } else {
    return <h3>{title || 'An error occured.'}</h3>
  }
}

export default App
