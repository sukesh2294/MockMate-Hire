import { useCallback, useState } from 'react'

function detectBrowserCompatibility() {
  return (
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia &&
    (window.RTCPeerConnection || window.webkitRTCPeerConnection)
  )
}

export function useMediaPermissions() {
  const [camera, setCamera] = useState({ status: 'pending', error: null })
  const [microphone, setMicrophone] = useState({ status: 'pending', error: null })
  const [screenShare, setScreenShare] = useState({ status: 'pending', error: null })
  const [browserCompatible] = useState(detectBrowserCompatibility)

  const requestCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach((t) => t.stop())
      setCamera({ status: 'granted', error: null })
      return true
    } catch (err) {
      setCamera({ status: 'denied', error: err.message })
      return false
    }
  }, [])

  const requestMicrophone = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((t) => t.stop())
      setMicrophone({ status: 'granted', error: null })
      return true
    } catch (err) {
      setMicrophone({ status: 'denied', error: err.message })
      return false
    }
  }, [])

  const requestScreenShare = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
      stream.getTracks().forEach((track) => track.stop())
      setScreenShare({ status: 'granted', error: null })
      return true
    } catch (err) {
      setScreenShare({ status: 'denied', error: err.message })
      return false
    }
  }, [])

  const allGranted =
    camera.status === 'granted' &&
    microphone.status === 'granted' &&
    screenShare.status === 'granted' &&
    browserCompatible

  return {
    camera,
    microphone,
    screenShare,
    browserCompatible,
    requestCamera,
    requestMicrophone,
    requestScreenShare,
    allGranted,
  }
}
