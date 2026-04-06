import {useState} from "react"
import API from "../api/axios"
import {useNavigate,Link} from "react-router-dom"
import "../styles/auth.css"

function Signin(){

const navigate = useNavigate()

const [form,setForm] = useState({
username:"",
password:""
})

const handleChange=(e)=>{

setForm({...form,[e.target.name]:e.target.value})

}

const handleSubmit=async(e)=>{

e.preventDefault()

try{

await API.post("/auth/signin",form)

navigate("/dashboard")

}catch(err){

alert(err.response?.data?.message || "Login failed")

}

}

return(

<div className="auth-container">

<div className="auth-card">

<div className="auth-logo">⚖</div>
<h2>Login</h2>

<form onSubmit={handleSubmit}>

<input
name="username"
placeholder="Enter username"
onChange={handleChange}
/>

<input
type="password"
name="password"
placeholder="Enter password"
onChange={handleChange}
/>

<button type="submit">
Login Now
</button>

</form>

<div className="auth-link">
Not a member? <Link to="/signup">Signup</Link>
</div>

</div>

</div>

)

}

export default Signin