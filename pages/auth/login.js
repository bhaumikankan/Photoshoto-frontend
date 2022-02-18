import { useRouter } from "next/router";
import { useState } from "react";
import axios  from "axios";

function login() {
  const router = useRouter();
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");

  const gotoRegister = (e) => {
    e.preventDefault();
    router.replace("/auth/register");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const data={email: email, password: password};
    axios.post('https://photoshoto-backend.herokuapp.com/auth/login',data)
    .then((res) => {
      if(res.data.token)
      {
        localStorage.setItem('token', res.data.token);
        router.replace('/');
      }else{
        window.alert(res.data.msg);
      }
    })
    .catch((err) => {
      window.alert("something went wrong");
    })
  }

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleLogin} className="flex flex-col  rounded-md shadow-2xl   max-w-md w-full space-y-5 p-5 ">
        <h1 className="text-center text-4xl font-bold text-lime-600 ">
          Login
        </h1>
        <span className="block text-sm font-medium text-slate-700 after:content-['*'] after:ml-0.5 after:text-red-500">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className=" text-black   px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
          placeholder="Email"
        />
        <span className="block text-sm font-medium text-slate-700 after:content-['*'] after:ml-0.5 after:text-red-500">Password</span>
        <input
          type="password"
          required
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className=" text-black  px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
          placeholder="Password"
        />

        <input
          className="bg-lime-600 cursor-pointer text-white rounded-md p-2"
          type="submit"
        ></input>
        <button
          className="text-blue-500 text-center mt-1"
          onClick={gotoRegister}
        >
          Don't have a account,click here
        </button>
      </form>
    </div>
  );
}

export default login;
