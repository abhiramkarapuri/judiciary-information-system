import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Signin from "./pages/Signin"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import CaseDetails from "./pages/CaseDetails"
import AddCase from "./pages/AddCase"

import ProtectedRoute from "./components/ProtectedRoute"
import AddJudge from "./pages/AddJudge"
import AddLawyer from "./pages/AddLawyer"
function App(){

return(

<BrowserRouter>

<Routes>

<Route path="/" element={<Navigate to="/signin" />} />

<Route path="/signin" element={<Signin/>}/>
<Route path="/signup" element={<Signup/>}/>

<Route
path="/dashboard"
element={
<ProtectedRoute>
<Dashboard/>
</ProtectedRoute>
}
/>

<Route
path="/case/:id"
element={
<ProtectedRoute>
<CaseDetails/>
</ProtectedRoute>
}
/>

<Route
path="/addcase"
element={
<ProtectedRoute>
<AddCase/>
</ProtectedRoute>
}
/>
<Route path="/addjudge" element={<AddJudge/>}/>
<Route path="/addlawyer" element={<AddLawyer/>}/>
</Routes>

</BrowserRouter>

)

}

export default App