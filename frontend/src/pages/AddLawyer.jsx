import {useState} from "react"
import API from "../api/axios"
import Layout from "../components/Layout"

function AddLawyer(){

  const [form,setForm] = useState({
    email:"",
    username:"",
    password:""
  })

  const handleChange=(e)=>{
    setForm({...form,[e.target.name]:e.target.value})
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
    try{
      await API.post("/auth/addlawyer",form)
      alert("Lawyer added successfully")
    }catch(err){
      console.error(err)
      alert("Failed to add lawyer: " + (err.response?.data?.message || err.message))
    }
  }

  return(
    <Layout>
      <div className="case-form" style={{maxWidth: '500px'}}>
        <h2>Add Lawyer</h2>
        <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'15px'}}>
          
          <div>
            <label>Email</label>
            <input 
              name="email" 
              placeholder="Enter Lawyer Email" 
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Username</label>
            <input 
              name="username" 
              placeholder="Choose a Username" 
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Password</label>
            <input 
              type="password"
              name="password" 
              placeholder="Create a Password" 
              onChange={handleChange}
            />
          </div>

          <button className="btn-main" style={{marginTop:'10px'}}>
            Add Lawyer
          </button>
        </form>
      </div>
    </Layout>
  )
}

export default AddLawyer