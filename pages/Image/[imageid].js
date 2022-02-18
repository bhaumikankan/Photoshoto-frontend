import axios from 'axios';
import React, { useEffect , useState} from 'react';
import {useRouter} from 'next/router'
import Image from 'next/image';
import {saveAs} from 'file-saver'
import Navbar from '../../components/Navbar'
import {
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  WhatsappShareButton,
  WhatsappIcon
} from 'react-share'


function ImageView({id}) {
  const router=useRouter()
  const [photo,setPhoto]=useState({});
  const [url,setUrl]=useState("https://miro.medium.com/max/882/1*9EBHIOzhE1XfMYoKz1JcsQ.gif")

  useEffect(()=>{
    axios.get('https://photoshoto-backend.herokuapp.com/public/singelPhoto/' + id)
    .then((res)=>{
      setUrl(res.data.data.imageuri);
      setPhoto(res.data.data);
    })
    .catch((error)=>{
      window.alert('something went wrong');
    })
  },[])

  const gotoProfile=(id)=>{
    if(id==localStorage.getItem('id')){
      router.push('/profile/'+localStorage.getItem('username'));
    }else{
      router.push('/profile/public/'+id);
    }
  }
  return (
    <div>
      <Navbar/>
    <div className="m-3">
      <div className="border-4 border-lime-100">
        <Image  
        layout='responsive'
          src={url} 
          height={200}
          width={500}
          />
     </div>
     <h1 className="uppercase text-lime-600 text-2xl font-bold">{photo.caption}</h1>
     <h1 className="uppercase text-lime-600 ">Uploaded by <button onClick={()=>{gotoProfile(photo.userid)}} className='text-blue-500'>{photo.username}</button></h1>
     <button className="bg-lime-600 text-white p-1" onClick={() => {saveAs(photo.imageuri,photo.caption)}}>Download</button>
     <p className="text-lime-600 mt-2">Share this using</p>
     <div className="flex gap-2">
         <FacebookShareButton
         url={'http://localhost:3000/Image/'+photo._id}
         quote={'checkout this image post or get only image from '+photo.photouri}
         >
         <FacebookIcon size={32}/>
         </FacebookShareButton>

         <WhatsappShareButton
         url={'http://localhost:3000/Image/'+photo._id}
         quote={'checkout this image post or get only image from '+photo.photouri}
         >
         <WhatsappIcon size={32}/>
         </WhatsappShareButton>

         <LinkedinShareButton
         url={'http://localhost:3000/Image/'+photo._id}
         quote={'checkout this image post or get only image from '+photo.photouri}
         >
         <LinkedinIcon size={32}/>
         </LinkedinShareButton>

     </div>
    </div>
    </div>
  )
}

ImageView.getInitialProps = (ctx) => {
  return {id:ctx.query.imageid}
}

export default ImageView