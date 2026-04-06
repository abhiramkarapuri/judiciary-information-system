import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import API from "../api/axios"

function ProtectedRoute({ children }) {

const [loading,setLoading] = useState(true)
const [authenticated,setAuthenticated] = useState(false)

useEffect(()=>{

const checkAuth = async () => {

try {

await API.get("/auth/check")

setAuthenticated(true)

} catch {

setAuthenticated(false)

}

setLoading(false)

}

checkAuth()

},[])

if(loading) return <p>Loading...</p>

if(!authenticated){

return <Navigate to="/signin"/>

}

return children
}

export default ProtectedRoute