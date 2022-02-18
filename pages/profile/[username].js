import { useEffect, useState ,useRef} from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import Link from "next/link";

function Profile() {
  const router = useRouter();
  const [url, setUrl] = useState(
    "https://images.unsplash.com/photo-1457449940276-e8deed18bfff?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
  );
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [photos, setPhoto] = useState([]);
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.replace("/");
    }
    axios
      .get("https://photoshoto-backend.herokuapp.com/profile/getProfilePic/", {
        headers: {
          "Content-Type": "application/json",
          "x-user-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
            setUrl(res.data.profilePic.picture);
      })
      .catch((err) => {
        console.log(err);
      });
    
    axios
      .get("https://photoshoto-backend.herokuapp.com/profile/findPost/", {
        headers: {
          "Content-Type": "application/json",
          "x-user-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
          setPhoto(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setEmail(localStorage.getItem("email"));
    setUsername(localStorage.getItem("username"));
  },[]);

  const gotoCreatePost = () => {
    router.push("/profile/createPost");
  };

  const handelDelete=(id) => {
    axios
      .delete("https://photoshoto-backend.herokuapp.com/profile/deletePost/"+id, {
        headers: {
          "Content-Type": "application/json",
          "x-user-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        router.reload("/")
      })
      .catch((err) => {
        window.alert('unable to delete');
      });
  }


  return (
    <div>
      <Navbar/>
    <div className="grid grid-cols-1 md:grid-cols-3  gap-3 p-3">
      <div className=" flex flex-col shadow-2xl gap-4   py-12 px-4 sm:flex-row sm:px-6 lg:px-8">
        <Image src={url} height={200} width={200} />
        <div className="flex flex-col">
          <p className="font-bold text-2xl uppercase text-lime-600">{username}</p>
          <p className="text-lime-600">{email}</p>
          <p className="text-lime-600">You have {photos.length} posts</p>
          <button
            className="bg-lime-600 text-white my-1 transition ease-in-out hover:scale-105 p-1 rounded md:hidden"
            onClick={gotoCreatePost}
          >
            Create a new post
          </button>
        </div>
      </div>
      <div className="hidden sm:col-span-2 md:block">
      <div className="  shadow-2xl  py-12 px-4 ">
        <h1 className="text-2xl font-bold uppercase text-lime-600">Hey {username}</h1>
        <p className='text-lime-600'>Upload your pictures and showcase your photography skill</p>
        <div className="flex gap-3 mt-3">
        <button
            className="bg-lime-600 text-white  transition ease-in-out hover:scale-105 p-1 hidden rounded md:block"
            onClick={gotoCreatePost}
          >
            Create a new post
          </button>
        </div>
      </div>
      </div>
      <div className=" col-span-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4">
        
        {photos.map((photo, index) => (
           <div key={index} className=" cursor-pointer transition ease-in-out shadow-lg border-2 border-lime-200   hover:scale-105 " href={`${photo.imageuri}`}>
            <Link href={`/Image/${photo._id}`}><a><Image src={photo.imageuri} height={500} width={500} /></a></Link>
            <div className="flex justify-evenly items-center p-2">
              <p className="font-bold uppercase text-lime-600" >{photo.caption}</p>
              <button className="bg-lime-600 text-white p-1" onClick={() => {saveAs(photo.imageuri,photo.caption)}}>Download</button>
              <button className="bg-red-600 text-white p-1" onClick={()=>{handelDelete(photo._id)}}>Delete</button>
            </div>  
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default Profile;
