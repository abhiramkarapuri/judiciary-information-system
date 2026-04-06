import Navbar from "./Navbar"
import Footer from "./Footer"

function Layout({ children }) {

return (

<div>

<Navbar />

<div style={{ minHeight: "80vh", padding: "20px" }}>
{children}
</div>

<Footer />

</div>

)

}

export default Layout