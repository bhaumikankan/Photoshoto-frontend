import { useRouter } from "next/router";
import { useState } from "react";
import { Web3Storage,getFilesFromPath } from 'web3.storage'
import {create} from "ipfs-http-client"
import axios  from "axios";
import * as imageConversion from 'image-conversion';
import {RefreshIcon} from '@heroicons/react/outline'

const client = new Web3Storage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDlmMjY0Nzk1YWJmZDJjOWI1MjMxNmJCRDZBOTQxNDYzNTZCODI3NzAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDQ5MjMzMjYyNzgsIm5hbWUiOiJQaG90b3Nob3RvIn0.IdhbnggEcoP_pd0CZYilnbYJ_xMQXdA6Afk41VdQUj4' })
const ipfs = create('https://ipfs.infura.io:5001/api/v0')

function register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(undefined);
  const[load,setLoad]=useState(false);

  const [password, setPassword] = useState("");
  const gotoLogin = (e) => {
    e.preventDefault();
    router.replace("/auth/login");
  };

  const updateFile = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setFile(file);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const fileFormat=(file.type=='image/png'||file.type=='image/jpeg');
    if(fileFormat)
    {
    setLoad(true);  
    const res=await imageConversion.compressAccurately(file,50);
    const root = await ipfs.add(res);
    const url= `https://ipfs.io/ipfs/${root.path}`; 
    const data={ username: username, email: email, picture: url ,password: password};
    axios.post('https://photoshoto-backend.herokuapp.com/auth/register',data)
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
  }else{
    window.alert('image file format must be .jpg or .png')
  }

  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleRegister}
        className="flex flex-col  rounded-md shadow-2xl   max-w-md w-full space-y-5 p-5 "
      >
        <h1 className="text-center text-4xl font-bold text-lime-600 mb-2">
          Register
        </h1>
        <span className="block text-sm font-medium text-slate-700 after:content-['*'] after:ml-0.5 after:text-red-500">
          Username
        </span>
        <input
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 text-black px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
          placeholder="Username"
        />
        <span className="block text-sm font-medium text-slate-700 after:content-['*'] after:ml-0.5 after:text-red-500">
          Email
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 text-black  px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
          placeholder="Email"
        />
        <span className="block text-sm font-medium text-slate-700 after:content-['*'] after:ml-0.5 after:text-red-500">
          Profile picture
        </span>
        <input
          type="file"
          required
          onChange={updateFile}
          className="mt-1 text-black  px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
        />
        <span className="block text-sm font-medium text-slate-700 after:content-['*'] after:ml-0.5 after:text-red-500">
          Password
        </span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 text-black  px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
          placeholder="Password"
        />

        <input
          className="bg-lime-600 cursor-pointer mt-2 text-white rounded-md p-2"
          type="submit"
        ></input>
        {load&&<div
            className="spinner-border  animate-spin inline-block w-8 h-8 border-4 rounded-full"
            role="status"
          >
            <RefreshIcon></RefreshIcon>
          </div>
        }
        <button className="text-blue-500 text-center mt-1" onClick={gotoLogin}>
          Have a account,click here
        </button>
      </form>
    </div>
  );
}

export default register;
