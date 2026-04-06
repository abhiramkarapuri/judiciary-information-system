import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import API from "../api/axios"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function CaseDetails(){

  const { id } = useParams()

  const [caseData, setCaseData] = useState(null)
  const [error, setError] = useState("")

  const [session,setSession] = useState({
    attendingJudge:"",
    summary:"",
    nextHearingDate:""
  })

  useEffect(() => {

    const fetchCase = async () => {
      try {
        const res = await API.get(`/cases/${id}`)
        setCaseData(res.data)
      } catch (err) {
        console.error(err)
        setError("Failed to load case details")
      }
    }

    fetchCase()

  }, [id])

  const formatDate = (d) => {
    if (!d) return "-"
    const date = new Date(d)
    if (isNaN(date)) return d
    return date.toLocaleDateString()
  }

  const handleSessionChange=(e)=>{
    setSession({...session,[e.target.name]:e.target.value})
  }

  const handleAddSession = async(e)=>{
    e.preventDefault()
    try{
      await API.post(`/cases/${id}/session`,session)
      const res = await API.get(`/cases/${id}`)
      setCaseData(res.data)
      setSession({attendingJudge:"", summary:"", nextHearingDate:""}) // clear form
    }catch(err){
      console.error(err)
      alert("Failed to add session: " + (err.response?.data?.message || err.message))
    }
  }

  if (error) {
    return (
      <>
        <Navbar/>
        <div style={{padding:"40px", textAlign:"center"}}>
          <p style={{color:"red", fontSize:"1.2rem"}}>{error}</p>
        </div>
        <Footer/>
      </>
    )
  }

  if (!caseData) {
    return (
      <>
        <Navbar/>
        <div style={{padding:"40px", textAlign:"center"}}>
          <p style={{fontSize:"1.2rem", color:"var(--text-light)"}}>Loading Case Dossier...</p>
        </div>
        <Footer/>
      </>
    )
  }

  const handleCloseCase = async ()=>{
    if(!window.confirm("Are you sure you want to close this case?")) return;
    try{
      await API.patch(`/cases/${id}/close`)
      alert("Case closed")
      window.location.reload()
    }catch(err){
      console.error(err)
      alert("Failed to close case: " + (err.response?.data?.message || err.message))
    }
  }

  const HearingStatusBadge = () => {
    if(caseData.closed) return <span className="badge closed" style={{marginLeft:"15px", fontSize:"1rem"}}>Closed</span>
    return <span className="badge active" style={{marginLeft:"15px", fontSize:"1rem"}}>Active</span>
  }

  return (
    <>
      <Navbar/>

      <div className="case-details-wrapper">

        <h2 className="case-title">
          <span>{caseData.caseTitle}</span>
          <HearingStatusBadge />
        </h2>

        <div className="case-details-card">
          <div className="header-meta">
            <div>
              <span style={{color:"var(--text-light)", fontSize:"0.9rem"}}>Case Identification Number (CIN)</span>
              <h3 style={{margin:"5px 0 0 0", color:"var(--accent)", fontSize:"1.5rem"}}>{caseData.CIN}</h3>
            </div>
            {!caseData.closed && (
              <button className="close-btn" style={{marginTop:"0"}} onClick={handleCloseCase}>
                Close Case
              </button>
            )}
          </div>
          
          <div className="details-grid">

            <div className="details-item">
              <label>Defendant</label>
              <p>{caseData.defendantName}</p>
            </div>
            
            <div className="details-item">
              <label>Address</label>
              <p>{caseData.defendantAddress}</p>
            </div>

            <div className="details-item">
              <label>Crime Type</label>
              <p>{caseData.crimeType}</p>
            </div>

            <div className="details-item">
              <label>Committed Date</label>
              <p>{formatDate(caseData.committedDate)}</p>
            </div>

            <div className="details-item">
              <label>Location</label>
              <p>{caseData.committedLocation}</p>
            </div>

            <div className="details-item">
              <label>Arresting Officer</label>
              <p>{caseData.arrestingOfficer}</p>
            </div>

            <div className="details-item">
              <label>Date of Arrest</label>
              <p>{formatDate(caseData.dateOfArrest)}</p>
            </div>

            <div className="details-item">
              <label>Presiding Judge</label>
              <p>{caseData.presidingJudge}</p>
            </div>

            <div className="details-item">
              <label>Public Prosecutor</label>
              <p>{caseData.publicProsecutor}</p>
            </div>

            <div className="details-item">
              <label>Next Hearing</label>
              <p style={{background:"rgba(245, 158, 11, 0.1)", borderColor:"rgba(245, 158, 11, 0.2)", color:"var(--upcoming-color)", fontWeight:"600"}}>
                {formatDate(caseData.dateOfHearing)}
              </p>
            </div>

            {caseData.closed && (
              <div className="details-item">
                <label>Completion Date</label>
                <p style={{background:"rgba(239, 68, 68, 0.1)", borderColor:"rgba(239, 68, 68, 0.2)", color:"var(--closed-color)", fontWeight:"600"}}>
                  {formatDate(caseData.completionDate)}
                </p>
              </div>
            )}

          </div>

        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', marginBottom: '10px'}}>
          <h3 style={{margin:0}}>Hearing Sessions</h3>
        </div>

        <div className="timeline">

          {(!caseData.sessions || caseData.sessions.length === 0) && (
            <p style={{color: 'var(--text-light)', fontStyle:'italic'}}>No sessions recorded yet.</p>
          )}

          {caseData.sessions && caseData.sessions.map((s,i)=>(
            <div className="timeline-item" key={i}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4 style={{color: 'var(--accent)'}}>Hearing Session #{i+1}</h4>
                <p style={{marginBottom:'8px'}}><strong>Judge:</strong> {s.attendingJudge}</p>
                <div style={{background: '#f8fafc', padding: '12px', borderRadius:'6px', border:'1px solid #e2e8f0', marginBottom:'12px'}}>
                  <p><strong>Summary:</strong> <br/>{s.summary}</p>
                </div>
                {s.nextHearingDate && (
                  <p><strong>Scheduled Next Hearing:</strong> {formatDate(s.nextHearingDate)}</p>
                )}
              </div>
            </div>
          ))}

        </div>

        {!caseData.closed && (
          <>
            <h3 style={{marginTop:"40px"}}>Log New Session</h3>
            <div className="session-card">
              <form onSubmit={handleAddSession} className="session-form">
                <div>
                  <label>Attending Judge</label>
                  <input
                    name="attendingJudge"
                    placeholder="Enter Attending Judge Name"
                    value={session.attendingJudge}
                    onChange={handleSessionChange}
                    required
                  />
                </div>
                <div>
                  <label>Hearing Summary</label>
                  <textarea
                    name="summary"
                    placeholder="Document the hearing highlights and decisions..."
                    value={session.summary}
                    onChange={handleSessionChange}
                    rows="4"
                    required
                  />
                </div>
                <div>
                  <label>Next Hearing Date</label>
                  <input
                    type="date"
                    name="nextHearingDate"
                    value={session.nextHearingDate}
                    onChange={handleSessionChange}
                  />
                </div>

                <button className="btn-main" style={{width: 'auto', alignSelf: 'flex-start'}}>
                  Save Session Log
                </button>

              </form>
            </div>
          </>
        )}

      </div>
      <Footer/>
    </>
  )
}

export default CaseDetails