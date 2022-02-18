import { create } from "ipfs-http-client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import {RefreshIcon} from '@heroicons/react/outline'
import Navbar from "../../components/Navbar"
import * as imageConversion from 'image-conversion';

const ipfs = create("https://ipfs.infura.io:5001/api/v0");
function CreatePost() {
  const router = useRouter();
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(undefined);
  const[load,setLoad]=useState(false);
  
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.replace("/");
    }
  }, []);

  const updateFile = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const fileFormat=(file.type=='image/png'||file.type=='image/jpeg')
    if(fileFormat)
    {
    setLoad(true);  
    const res=await imageConversion.compressAccurately(file,100);
    const root = await ipfs.add(res);
    const url= `https://ipfs.io/ipfs/${root.path}`; 
    const data = {
      username: localStorage.getItem("username"),
      userid: localStorage.getItem("id"),
      caption: caption,
      imageuri: url,
    };
    axios
      .post("https://photoshoto-backend.herokuapp.com/profile/createpost", data, {
        headers: {
          "Content-Type": "application/json",
          "x-user-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setCaption("");
        setFile(undefined);
        router.push("/");
      })
      .catch((err) => {
        console.log(err);
        window.alert("something went wrong");
      });
    
    }else{
      window.alert('image file format must be .jpg or .png')
    }
    
  };
  return (
    <div>
      <Navbar/>
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleUpload}
        className="flex flex-col  rounded-md shadow-2xl   max-w-md w-full space-y-5 p-5 "
      >
        <h1 className="text-center text-4xl font-bold text-lime-600 mb-2">
          Post New Photo
        </h1>
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
          Caption
        </span>
        <input
          type="text"
          required
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="mt-1 text-black  px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
          placeholder="Caption"
        />

        <input
          className="bg-lime-600 cursor-pointer mt-2 text-white rounded-md p-2"
          type="submit"
        ></input>
        <div className="flex justify-center items-center">
        {load&&<div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
            role="status"
          >
            <RefreshIcon></RefreshIcon>
          </div>
        }
        </div>
      </form>
    </div>
    </div>
  );
}

export default CreatePost;
