import Layout from "../components/Layout"
import { useEffect, useState } from "react"
import API from "../api/axios"
import { Link } from "react-router-dom"

function Dashboard(){

const [cases,setCases] = useState([])
const [searchCIN,setSearchCIN] = useState("")
const [searchKeyword,setSearchKeyword] = useState("")
const [filter,setFilter] = useState("all")

useEffect(()=>{

const fetchCases = async ()=>{

const res = await API.get("/cases")

setCases(res.data)

}

fetchCases()

},[])

const filteredCases = cases.filter(c=>{

const today = new Date()
const hearing = new Date(c.dateOfHearing)

let status="Upcoming"

if(c.closed) status="Past"
else if(hearing.toDateString() === today.toDateString())
status="Active"

if(filter === "all") return true
if(filter === "active") return status === "Active"
if(filter === "upcoming") return status === "Upcoming"
if(filter === "closed") return status === "Past"

return true

})

return(

<Layout>

<div className="card-ui">

<h2>Cases</h2>
<div className="filter-tabs">

<button className={filter === "all" ? "active-tab" : ""} onClick={()=>setFilter("all")}>All Cases</button>

<button className={filter === "active" ? "active-tab" : ""} onClick={()=>setFilter("active")}>Active</button>

<button className={filter === "upcoming" ? "active-tab" : ""} onClick={()=>setFilter("upcoming")}>Upcoming</button>

<button className={filter === "closed" ? "active-tab" : ""} onClick={()=>setFilter("closed")}>Closed</button>

</div>
<div className="search-bar">

<input
placeholder="Search by CIN"
value={searchCIN}
onChange={(e)=>setSearchCIN(e.target.value)}
/>

<input
placeholder="Search by keyword"
value={searchKeyword}
onChange={(e)=>setSearchKeyword(e.target.value)}
/>

</div>

<div className="table-wrapper">
<table>

<thead>
<tr>
<th>CIN</th>
<th>Status</th>
<th>Title</th>
<th>Details</th>
</tr>
</thead>

<tbody>

{filteredCases.map(c=>{

const today = new Date()
const hearing = new Date(c.dateOfHearing)

let status="Upcoming"

if(c.closed) status="Past"
else if(hearing.toDateString() === today.toDateString())
status="Active"

return(

<tr key={c._id}>

<td><span style={{fontWeight:500}}>{c.CIN}</span></td>

<td>

{status === "Past" && <span className="badge closed">Past</span>}
{status === "Active" && <span className="badge active">Active</span>}
{status === "Upcoming" && <span className="badge upcoming">Upcoming</span>}

</td>

<td>{c.caseTitle}</td>

<td>
<Link className="view-btn" to={`/case/${c._id}`}>View Details</Link>
</td>

</tr>

)

})}

</tbody>

</table>
</div>

</div>

</Layout>

)

}

export default Dashboard