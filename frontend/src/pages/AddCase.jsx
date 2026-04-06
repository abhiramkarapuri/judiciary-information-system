import { useState } from "react"
import API from "../api/axios"
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"

function AddCase(){

  const navigate = useNavigate()
  const [form,setForm] = useState({})

  const handleChange = (e)=>{
    setForm({...form,[e.target.name]:e.target.value})
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    try{
      await API.post("/cases",form)
      navigate("/dashboard")
    }catch(err){
      alert("Error adding case: " + (err.response?.data?.message || err.message))
    }
  }

  return(
    <Layout>
      <div className="case-form">
        <h2>Add New Case</h2>
        <form onSubmit={handleSubmit}>
          
          <div className="form-grid">
            
            <div>
              <label>Case Title</label>
              <input name="caseTitle" placeholder="Enter Case Title" onChange={handleChange}/>
            </div>
            
            <div>
              <label>Defendant Name</label>
              <input name="defendantName" placeholder="Enter Defendant Name" onChange={handleChange}/>
            </div>

            <div>
              <label>Defendant Address</label>
              <input name="defendantAddress" placeholder="Enter Defendant Address" onChange={handleChange}/>
            </div>
            
            <div>
              <label>Crime Type</label>
              <input name="crimeType" placeholder="Enter Crime Type" onChange={handleChange}/>
            </div>

            <div>
              <label>Committed Date</label>
              <input type="date" name="committedDate" onChange={handleChange}/>
            </div>
            
            <div>
              <label>Committed Location</label>
              <input name="committedLocation" placeholder="Enter Crime Location" onChange={handleChange}/>
            </div>

            <div>
              <label>Arresting Officer</label>
              <input name="arrestingOfficer" placeholder="Enter Arresting Officer" onChange={handleChange}/>
            </div>
            
            <div>
              <label>Date of Arrest</label>
              <input type="date" name="dateOfArrest" onChange={handleChange}/>
            </div>

            <div>
              <label>Presiding Judge</label>
              <input name="presidingJudge" placeholder="Enter Presiding Judge" onChange={handleChange}/>
            </div>
            
            <div>
              <label>Public Prosecutor</label>
              <input name="publicProsecutor" placeholder="Enter Public Prosecutor" onChange={handleChange}/>
            </div>

            <div>
              <label>Date of Hearing</label>
              <input type="date" name="dateOfHearing" onChange={handleChange}/>
            </div>

          </div>

          <button className="btn-main" style={{marginTop:'25px'}}>
            Add Case
          </button>
        </form>
      </div>
    </Layout>
  )
}

export default AddCase