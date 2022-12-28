import { useRouter } from 'next/router'
import React from 'react'
import { toast } from 'react-hot-toast'
import useSWR from 'swr'

const Token = () => {
  const router = useRouter()
  const { token } = router.query
  const {data, error, isLoading} = useSWR('verify',async()=>{
    if(!token) return
    const res = await fetch(`/api/verify/${token}`)
    const data = await res.json()
    if(res.status!==200 && data.message){
      toast.error(data.message)
    }
    router.push('/login')
    return data
  })
  if(error) return <div>Error</div>
  if(isLoading) return <div>Loading...</div>
  toast.success('Email verified. Redirecting to dashboard...')
  router.push('/dashboard')
}

export default Token