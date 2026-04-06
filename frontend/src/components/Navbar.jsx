import { useNavigate, Link, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import API from "../api/axios"

function Navbar(){

  const navigate = useNavigate()
  const location = useLocation()

  const [user,setUser] = useState(null)

  useEffect(()=>{

    const fetchUser = async ()=>{
      try{
        const res = await API.get("/auth/check")
        setUser(res.data.user)
      }catch(err){
        console.log("Not logged in",err)
      }
    }

    fetchUser()

  },[])

  const handleLogout = async () => {
    await API.get("/auth/logout")
    navigate("/signin")
  }

  const getRole = () => {
    if(!user) return "";
    if(user.isLawyer) return "Lawyer";
    if(user.isJudge) return "Judge";
    return "Registrar";
  }

  return(
    <nav style={{
      display:"flex",
      justifyContent:"space-between",
      alignItems:"center",
      padding:"16px 32px",
      background:"var(--nav-bg)",
      color:"white",
      boxShadow:"0 4px 20px rgba(0,0,0,0.1)",
      backdropFilter:"blur(10px)",
      borderBottom:"1px solid rgba(255,255,255,0.05)"
    }}>

      <div style={{display:"flex", alignItems:"center", gap:"10px", cursor:"pointer"}} onClick={()=>navigate("/dashboard")}>
        <span style={{fontSize:"1.5rem", color:"var(--accent)"}}>⚖</span>
        <h3 style={{margin:0, color:"white", letterSpacing:"0.5px", fontSize:"1.2rem"}}>
          Judiciary System
        </h3>
      </div>

      <div style={{display:"flex",gap:"20px",alignItems:"center"}}>
        
        {user && (
          <div style={{
            display: "flex", 
            alignItems: "center", 
            marginRight: "10px",
            background: "rgba(255,255,255,0.05)",
            padding: "6px 12px",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            <span style={{fontSize:"0.8rem", color:"var(--text-light)", marginRight:"6px"}}>Welcome,</span>
            <span style={{fontSize:"0.85rem", fontWeight:"600", color:"white"}}>{user.username} <span style={{color:"var(--accent)", marginLeft:"4px"}}>({getRole()})</span></span>
          </div>
        )}

        <Link className={`nav-btn ${location.pathname === '/dashboard' ? 'active-nav' : ''}`} style={location.pathname === '/dashboard' ? {color: 'var(--accent)', background: 'rgba(197,160,89,0.1)'} : {}} to="/dashboard">
          Dashboard
        </Link>
        
        <Link className={`nav-btn ${location.pathname === '/addcase' ? 'active-nav' : ''}`} style={location.pathname === '/addcase' ? {color: 'var(--accent)', background: 'rgba(197,160,89,0.1)'} : {}} to="/addcase">
          Add Case
        </Link>
        
        {user?.isRegistrer && (
          <>
            <Link className={`nav-btn ${location.pathname === '/addjudge' ? 'active-nav' : ''}`} style={location.pathname === '/addjudge' ? {color: 'var(--accent)', background: 'rgba(197,160,89,0.1)'} : {}} to="/addjudge">Add Judge</Link>
            <Link className={`nav-btn ${location.pathname === '/addlawyer' ? 'active-nav' : ''}`} style={location.pathname === '/addlawyer' ? {color: 'var(--accent)', background: 'rgba(197,160,89,0.1)'} : {}} to="/addlawyer">Add Lawyer</Link>
          </>
        )}
        
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
        
      </div>
    </nav>
  )
}

export default Navbar