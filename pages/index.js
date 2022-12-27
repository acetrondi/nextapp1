
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'

const Home = () => {
  const supabaseClient = useSupabaseClient()
  const user = useUser()
  const [data, setData] = useState()
  const [isLogin, setIsLogin] = useState(false)
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");

  const handleRegister = async (email, firstname, lastname) => {
      try {
          const { error } = await supabaseClient.auth.signInWithOtp({
              email,
              options: {
                  data: {
                      firstname: firstname,
                      lastname: lastname,
                      usertype: "staff"
          },
      }    })
        if (error) throw error
        alert('Check your email for the login link!')
      } catch (error) {
        alert(error.error_description || error.message)
      } finally {
      }
  }
  
  const handleLogin = async (email) => {
    try {
      const { error } = await supabaseClient.auth.signInWithOtp({ email })
      
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
    }
  }

  useEffect(() => {
    async function loadData() {
      const { data } = await supabaseClient.from("doozy_"+user.user_metadata.usertype).select('*').eq('id',user.id).single()
      setData(data)
    }
    // Only run query once user is logged in.
    if (user) loadData()
  }, [user])

  if (!user)
    return (



      <div>
        <div>
          <button onClick={() => setIsLogin(true)}>Login</button>
          <button onClick={() => setIsLogin(false)}>Registration</button>
          
        </div>

        {isLogin ?

          <form >
            <input
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={(e) => {
                e.preventDefault()
                handleLogin(email)
              }}
              className="button block"
            >Sign In</button>
          </form> :
          <form >
            <input
              className="inputField"
              type="text"
              placeholder="Your firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            <input
              className="inputField"
              type="text"
              placeholder="Your lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
            <input
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={(e) => {
                e.preventDefault()
                handleRegister(email, firstname, lastname)
              }}
              className="button block"
            >Sign Up</button>
          </form>}

      </div>
    )

  return (
    <>
      <button onClick={() => supabaseClient.auth.signOut()}>Sign out</button>
      <p>{JSON.stringify(data, null, 2)}</p>
    </>
  )
}

export default Home