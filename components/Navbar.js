import {useRouter} from 'next/router'
import { useEffect,useState } from 'react';
import jwtDecode from 'jwt-decode';
import {UserCircleIcon} from '@heroicons/react/outline'

function Navbar() {
  const router=useRouter()
  const[isAuth,setAuth] = useState(false);
  const handleLogin=(e)=>{
     e.preventDefault();
     router.push('/auth/login');
  }
  const handleLogout=(e)=>{
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('id');
    localStorage.removeItem('email');
    router.reload('/')
 }
 const gotoProfile=(e)=>{
   e.preventDefault();
   router.push('/profile/'+localStorage.getItem('username'));
 }
  useEffect(()=>{
    if(localStorage.getItem('token'))
    {
      setAuth(true);
      const user=jwtDecode(localStorage.getItem('token'));
      localStorage.setItem('username',user.username);
      localStorage.setItem('id',user.id);
      localStorage.setItem('email',user.email);
    }
  },[])
  return (
    <div className="flex justify-between p-4 items-center bg-lime-100">
        <h1 className="text-2xl font-black cursor-pointer text-lime-600 sm:text-4xl " onClick={() =>router.push('/')}>PhotoShoto</h1>
        <div className="flex items-center">
        {
          isAuth&&<UserCircleIcon className="text-lime-500 h-14 cursor-pointer" onClick={gotoProfile}></UserCircleIcon>
        }
        {
          isAuth?(
            <button className="bg-red-600 p-2 text-white font-xs" onClick={handleLogout}>Logout</button>
          ):(
            <button className="bg-lime-600 p-2 text-white font-xs" onClick={handleLogin}>Login or Register</button>
          )
        }
        </div>
    </div>
  )
}

export default Navbar