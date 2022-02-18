import Head from "next/head";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios  from "axios";
import Image from "next/image";
import  { saveAs } from 'file-saver';
import Link from "next/link";

export default function Home({ result }) {
  const [quary, setQuary] = useState("");
  const[photos,setPhotos] = useState([]);
  useEffect(() => {
    axios
      .get("https://photoshoto-backend.herokuapp.com/public/findAllPost")
      .then((res) => {
        setPhotos(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  },[])
  const handelSearch = (e) => {
    e.preventDefault();
    setQuary(e.target.value);
    axios
      .get(`https://photoshoto-backend.herokuapp.com/public/findAllPost?caption=${e.target.value}`)
      .then((res) => {
        setPhotos(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Head>
        <title>PhotoShoto</title>
        <meta
          name="description"
          content="Best app to share your photography skill"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <div className="p-2 m-3">
        <h1 className="text-3xl font-bold text-lime-400">Search here</h1>
      <input
        type="text"
        required
        value={quary}
        onChange={handelSearch}
        className=" text-black px-3 py-2 max-w-md bg-white border-2 shadow-sm border-lime-600 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
        placeholder="Search by caption"
      />
      <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4">
        
        {photos.map((photo, index) => (
           <div key={index} className="relative cursor-pointer transition ease-in-out shadow-lg border-2 border-lime-200    hover:scale-105  " href={`${photo.imageuri}`}>
            <Link href={`/Image/${photo._id}`}><a><Image src={photo.imageuri} height={500} width={500} /></a></Link>
            <div className="flex justify-between items-center p-2">
              <p className="font-bold uppercase text-lime-600" >{photo.caption}</p>
              <button className="bg-lime-600 text-white p-1" onClick={() => {saveAs(photo.imageuri,photo.caption)}}>Download</button>
            </div>
          </div>
        ))}
      </div>
      </div>
      </div>
      
    </div>
  );
}
