import {useState} from "react"
import API from "../api/axios"
import {useNavigate,Link} from "react-router-dom"
import "../styles/auth.css"

function Signup(){

const navigate = useNavigate()

const [form,setForm] = useState({
email:"",
username:"",
secretkey:"",
password:"",
confirmPassword:""
})

const handleChange=(e)=>{
setForm({...form,[e.target.name]:e.target.value})
}

const handleSubmit = async(e)=>{

e.preventDefault()

try{

await API.post("/auth/signup",form)

navigate("/signin")

}catch(err){

console.log(err.response?.data)
alert(err.response?.data?.message || err.message || "Signup failed")

}

}

return(

<div className="auth-container">

<div className="auth-card">

<div className="auth-logo">⚖</div>
<h2>Signup</h2>

<form onSubmit={handleSubmit}>

<input
name="email"
placeholder="Enter email"
onChange={handleChange}
/>

<input
name="username"
placeholder="Enter username"
onChange={handleChange}
/>

<input
name="secretkey"
placeholder="Secret key"
onChange={handleChange}
/>

<input
type="password"
name="password"
placeholder="Enter password"
onChange={handleChange}
/>

<input
type="password"
name="confirmPassword"
placeholder="Confirm password"
onChange={handleChange}
/>

<button type="submit">
Signup
</button>

</form>

<div className="auth-link">
Already have an account? <Link to="/signin">Login</Link>
</div>

</div>

</div>

)

}

export default Signup