function Footer(){

return(

<footer
style={{
marginTop:"40px",
padding:"20px",
textAlign:"center",
background:"var(--nav-bg)",
color:"var(--text-light)",
fontSize: "0.9rem",
borderTop: "1px solid rgba(255,255,255,0.05)"
}}
>

<p style={{margin:0}}>© {new Date().getFullYear()} Judiciary Information System. All Rights Reserved.</p>

</footer>

)

}

export default Footer