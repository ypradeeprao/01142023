
import './App.css';
import React, { useState, useEffect, useRef } from 'react';
let socket = new WebSocket("wss://s8239.nyc1.piesocket.com/v3/1?api_key=eWE09fv3RllnW6tVNzfP85M4rCn6ckxRQfHLP4aX&notify_self=1");



socket.onopen = function (e) {
  consolelog("[open] Connection established");
  consolelog("Sending to server");
  //socket.send("My name is John");
};



socket.onmessage = function (event) {
 
  let datafromserver = JSON.parse(event.data);
  let {answer, meetingname, personname} = datafromserver.data;
  let localmeetingname = localStorage.getItem("localmeetingname");
  let localpersonname = localStorage.getItem("localpersonname");
  consolelog("localpersonname",localpersonname);
  consolelog("personname",personname);
if(localpersonname !== personname){
  consolelog("onmessageevent",event);
  consolelog("datafromserver",datafromserver);

  if (datafromserver &&
    (datafromserver.type === "createmeeting")
  ) {
    createMeeting(datafromserver);
  }
  if (datafromserver &&
    (datafromserver.type === "deletemeeting")
  ) {
    deleteMeeting(datafromserver);
  }

  if (datafromserver &&
    (datafromserver.type === "joinmeeting")
  ) {
    joinMeeting(datafromserver);
  }
  if (datafromserver &&
    (datafromserver.type === "quitmeeting")
  ) {
    quitMeeting(datafromserver);
  }
  if (datafromserver &&
    (datafromserver.type === "createoffer") &&
    datafromserver.data.offer
  ) {
    createAnswer(datafromserver.data.offer);
  }
  if (datafromserver &&
    (datafromserver.type === "answer")
  ) {
    addAnswer(datafromserver.data.answer);
  }
  if (datafromserver &&
    (datafromserver.type === "sendicecandidate")
  ) {
  //  handleCandidate(datafromserver);
  }
}

};

socket.onclose = function (event) {
  if (event.wasClean) {
    consolelog(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    consolelog('[close] Connection died');
  }
};

socket.onerror = function (error) {
  consolelog(`[error]`);
};

let consolelog = (a,b)=>{
console.log(a);
console.log(b);
};
let createMeeting = async (methodprops) => {
  
  consolelog("createMeeting",methodprops);
  let { meetingname, personname } = methodprops.data;
  let meetingsdata = localStorage.getItem("meetings");
  let meetingsdatajson = [];
  if (meetingsdata) {
    meetingsdatajson = JSON.parse(meetingsdata);
  }
 
  let localpersonname = localStorage.getItem("localpersonname");
  let ismeetingalreadyexists = false;
  if (meetingsdatajson && meetingsdatajson.length > 0) {
   
    consolelog("meetingsdatajson",meetingsdatajson);
    for (let i = 0; i < meetingsdatajson.length; i++) {
      consolelog("meetingsdatajson[i].name",meetingsdatajson[i].name);
      consolelog("meetingname",meetingname);
      if (meetingsdatajson[i].name === meetingname) {
        ismeetingalreadyexists = true;
      }
    }

  }

  consolelog("ismeetingalreadyexists",ismeetingalreadyexists);
  consolelog("localpersonname",localpersonname);
  consolelog("personname",personname);

  if (ismeetingalreadyexists === true && localpersonname === personname) {
    alert("meeting already exists");
  }
  else if (ismeetingalreadyexists === true && localpersonname !== personname) {
    
  }
  else {

    if (meetingsdatajson && meetingsdatajson.length > 0) {
    }
    else {
      meetingsdatajson = [];
    }
    let newmeeting = { name: meetingname };
    meetingsdatajson.push(newmeeting);
    consolelog("meetingsdatajson",meetingsdatajson);
    localStorage.setItem("meetings", JSON.stringify(meetingsdatajson));
  }

}
let deleteMeeting = async (methodprops) => {
  
  consolelog("deleteMeeting",methodprops);
  let { meetingname, personname } = methodprops.data;
  let meetingsdata = localStorage.getItem("meetings");
  let meetingsdatajson = [];
  let meetingsdatajsonU = [];
  if (meetingsdata) {
    meetingsdatajson = JSON.parse(meetingsdata);
  }
 
  let localpersonname = localStorage.getItem("localpersonname");
  let ismeetingalreadyexists = false;
  if (meetingsdatajson && meetingsdatajson.length > 0) {
   
    consolelog("meetingsdatajson",meetingsdatajson);
    for (let i = 0; i < meetingsdatajson.length; i++) {
      consolelog("meetingsdatajson[i].name",meetingsdatajson[i].name);
      consolelog("meetingname",meetingname);
      if (meetingsdatajson[i].name === meetingname) {
        ismeetingalreadyexists = true;
      }
      else{
        meetingsdatajsonU.push(meetingsdatajson[i]);
      }
    }

  }

  consolelog("ismeetingalreadyexists",ismeetingalreadyexists);
  consolelog("localpersonname",localpersonname);
  consolelog("personname",personname);

  if (ismeetingalreadyexists === false && localpersonname === personname) {
    alert("meeting not exists");
  }
  else if (ismeetingalreadyexists === false && localpersonname !== personname) {
    
  }
  else {
    localStorage.setItem("meetings", JSON.stringify(meetingsdatajsonU));
  }

}
let joinMeeting = async (methodprops) => {
  
  consolelog("joinMeeting",methodprops);
  let { meetingname, personname } = methodprops.data;
  let meetingsdata = localStorage.getItem("meetings");
  let meetingsdatajson = [];
  if (meetingsdata) {
    meetingsdatajson = JSON.parse(meetingsdata);
  }
 

  let meetingjoineesdata = localStorage.getItem("meetingjoinees");
  let meetingjoineesdatajson = [];
  if (meetingjoineesdata) {
    meetingjoineesdatajson = JSON.parse(meetingjoineesdata);
  }


  let meetingpeerconnectionsdata = localStorage.getItem("meetingpeerconnections");
  let meetingpeerconnectionsdatajson = [];
  if (meetingpeerconnectionsdata) {
    meetingpeerconnectionsdatajson = JSON.parse(meetingpeerconnectionsdata);
  }


  let localpersonname = localStorage.getItem("localpersonname");
  let ismeetingalreadyexists = false;
  let ismeetingjoineealreadyexists = false;
  if (meetingsdatajson && meetingsdatajson.length > 0) {
   
    consolelog("meetingsdatajson",meetingsdatajson);
    for (let i = 0; i < meetingsdatajson.length; i++) {
      consolelog("meetingsdatajson[i].name",meetingsdatajson[i].name);
      consolelog("meetingname",meetingname);
      if (meetingsdatajson[i].name === meetingname) {
        ismeetingalreadyexists = true;
      }
    }

  }

  if (meetingjoineesdatajson && meetingjoineesdatajson.length > 0) {
   
    consolelog("meetingjoineesdatajson",meetingjoineesdatajson);
    for (let i = 0; i < meetingjoineesdatajson.length; i++) {
      consolelog("meetingjoineesdatajson[i].name",meetingjoineesdatajson[i].name);
      consolelog("meetingname",meetingname);
      if (meetingjoineesdatajson[i].meetingname === meetingname && meetingjoineesdatajson[i].name === personname) {
        ismeetingjoineealreadyexists = true;
      }
      if (meetingjoineesdatajson[i].meetingname === meetingname && meetingjoineesdatajson[i].name !== personname) {
        let newmeetingpeerconnection = { requestfromname: personname, requesttoname:meetingjoineesdatajson[i].name,
           meetingname: meetingname};

        meetingpeerconnectionsdatajson.push(newmeetingpeerconnection);
      }
    }

  }



  consolelog("ismeetingalreadyexists",ismeetingalreadyexists);
  consolelog("localpersonname",localpersonname);
  consolelog("personname",personname);

  if (ismeetingalreadyexists === false && localpersonname === personname) {
    alert("meeting not exists");
  }
  else if (ismeetingalreadyexists === false && localpersonname !== personname) {
    
  }
  else if (ismeetingjoineealreadyexists === true && localpersonname === personname) {
    alert("meeting joinee already exists");
  }
  else if (ismeetingjoineealreadyexists === true && localpersonname !== personname) {
    
  }
  else {

    if (meetingjoineesdatajson && meetingjoineesdatajson.length > 0) {
    }
    else {
      meetingjoineesdatajson = [];
    }
    let newmeetingjoinee = { name: personname, meetingname: meetingname };
    meetingjoineesdatajson.push(newmeetingjoinee);
    consolelog("meetingjoineesdatajson",meetingjoineesdatajson);
    localStorage.setItem("meetingjoinees", JSON.stringify(meetingjoineesdatajson));
    if(meetingpeerconnectionsdatajson && meetingpeerconnectionsdatajson.length > 0){
    localStorage.setItem("meetingpeerconnections", JSON.stringify(meetingpeerconnectionsdatajson));
    
    }

    await resetPeerConnections();
  }

}
let quitMeeting = async (methodprops) => {
  
  consolelog("quitMeeting",methodprops);
  let { meetingname, personname } = methodprops.data;
  let meetingsdata = localStorage.getItem("meetings");
  let meetingsdatajson = [];
  if (meetingsdata) {
    meetingsdatajson = JSON.parse(meetingsdata);
  }
 

  let meetingjoineesdata = localStorage.getItem("meetingjoinees");
  let meetingjoineesdatajson = [];
  let meetingjoineesdatajsonU = [];
  if (meetingjoineesdata) {
    meetingjoineesdatajson = JSON.parse(meetingjoineesdata);
  }


  let meetingpeerconnectionsdata = localStorage.getItem("meetingpeerconnections");
  let meetingpeerconnectionsdatajson = [];
  let meetingpeerconnectionsdatajsonU= [];
  if (meetingpeerconnectionsdata) {
    meetingpeerconnectionsdatajson = JSON.parse(meetingpeerconnectionsdata);
  }



  let localpersonname = localStorage.getItem("localpersonname");
  let ismeetingalreadyexists = false;
  let ismeetingjoineealreadyexists = false;
  if (meetingsdatajson && meetingsdatajson.length > 0) {
   
    consolelog("meetingsdatajson",meetingsdatajson);
    for (let i = 0; i < meetingsdatajson.length; i++) {
      consolelog("meetingsdatajson[i].name",meetingsdatajson[i].name);
      consolelog("meetingname",meetingname);
      if (meetingsdatajson[i].name === meetingname) {
        ismeetingalreadyexists = true;
      }
    }

  }

  if (meetingjoineesdatajson && meetingjoineesdatajson.length > 0) {
   
    consolelog("meetingjoineesdatajson",meetingjoineesdatajson);
    for (let i = 0; i < meetingjoineesdatajson.length; i++) {
      consolelog("meetingjoineesdatajson[i].name",meetingjoineesdatajson[i].name);
      consolelog("meetingname",meetingname);
      if (meetingjoineesdatajson[i].meetingname === meetingname && meetingjoineesdatajson[i].name === personname) {
        ismeetingjoineealreadyexists = true;
      }
      else{
        meetingjoineesdatajsonU.push(meetingjoineesdatajson[i]);
      }

    }

  }



  if (meetingpeerconnectionsdatajson && meetingpeerconnectionsdatajson.length > 0) {
   
    consolelog("meetingpeerconnectionsdatajson",meetingpeerconnectionsdatajson);
    for (let i = 0; i < meetingpeerconnectionsdatajson.length; i++) {
      consolelog("meetingpeerconnectionsdatajson[i].name",meetingpeerconnectionsdatajson[i].name);
      consolelog("meetingname",meetingname);
      if (meetingpeerconnectionsdatajson[i].meetingname === meetingname 
        &&( meetingpeerconnectionsdatajson[i].requestfromname === personname
        || meetingpeerconnectionsdatajson[i].requesttoname === personname)) {
       
      }
      else{
        meetingpeerconnectionsdatajsonU.push(meetingpeerconnectionsdatajson[i]);
      }

    }

  }
  


  consolelog("ismeetingalreadyexists",ismeetingalreadyexists);
  consolelog("localpersonname",localpersonname);
  consolelog("personname",personname);

  if (ismeetingalreadyexists === false && localpersonname === personname) {
    alert("meeting not exists");
  }
  else if (ismeetingalreadyexists === false && localpersonname !== personname) {
    
  }
  else if (ismeetingjoineealreadyexists === false && localpersonname === personname) {
    alert("meeting joinee not exists");
  }
  else if (ismeetingjoineealreadyexists === false && localpersonname !== personname) {
    
  }
  else {


    consolelog("meetingjoineesdatajsonU",meetingjoineesdatajsonU);
    localStorage.setItem("meetingjoinees", JSON.stringify(meetingjoineesdatajsonU));
    if(meetingpeerconnectionsdatajsonU.length > 0){
      localStorage.setItem("meetingpeerconnections", JSON.stringify(meetingpeerconnectionsdatajsonU));
    }
  }

}

const servers = {
  iceServers:[
      {
          urls:['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
      }
  ]
}

let localStream;
let remoteStream;
let peerConnection;
let resetPeerConnections = async (methodprops) => {
  consolelog("resetPeerConnections",methodprops);

  let meetingjoineesdata = localStorage.getItem("meetingjoinees");
  let meetingjoineesdatajson = [];
  if (meetingjoineesdata) {
    meetingjoineesdatajson = JSON.parse(meetingjoineesdata);
  }


  let meetingpeerconnectionsdata = localStorage.getItem("meetingpeerconnections");
  let meetingpeerconnectionsdatajson = [];
  if (meetingpeerconnectionsdata) {
    meetingpeerconnectionsdatajson = JSON.parse(meetingpeerconnectionsdata);
  }
 await showLocalStreamVideo();
}

let createPeerConnection = async (methodprops) => {
  let {localmeetingname, localpersonname} = methodprops;
  peerConnection = new RTCPeerConnection(servers)

  remoteStream = new MediaStream();
 
  if(!localStream){
      localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:false})
    
      let myscreenvideo =  document.getElementById('myscreenvideo');
  myscreenvideo.srcObject = localStream;
  myscreenvideo.play();
  }

  //if(!remoteStream){
   
  
    let remotescreenvideo =  document.getElementById('remotescreenvideo');
    remotescreenvideo.srcObject = remoteStream;
    remotescreenvideo.play();
//}

  localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream)
  })

  peerConnection.ontrack = (event) => {
    consolelog("eventstreams",event.streams);
      event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track)
      })
  }


  peerConnection.onicecandidate = async (event) => {
      if(event.candidate){
        socket.send(JSON.stringify({ type: "sendicecandidate", data: { 
          meetingname: localmeetingname,
           personname: localpersonname,
           candidate: event.candidate } }));
  
     //     client.sendMessageToPeer({text:JSON.stringify({'type':'candidate', 'candidate':event.candidate})}, MemberId)
      }
  }
}

let showLocalStreamVideo = async (methodprops) => {
  consolelog("showLocalStreamVideo",methodprops);
  let constraints = window.constraints = {
    audio: false,
    video: true
  };
  localStream = await navigator.mediaDevices.getUserMedia(constraints);
  let myscreenvideo =  document.getElementById('myscreenvideo');
  myscreenvideo.srcObject = localStream;
  myscreenvideo.play();

}

let createOffer = async (MemberId) => {

  let localmeetingname = localStorage.getItem("localmeetingname");
  let localpersonname = localStorage.getItem("localpersonname");

  await createPeerConnection({localmeetingname:localmeetingname,localpersonname:localpersonname})

  let offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)

  socket.send(JSON.stringify({ type: "createoffer", data: { 
    meetingname: localmeetingname,
     personname: localpersonname,
     offer:offer
      } }));

 // client.sendMessageToPeer({text:JSON.stringify({'type':'offer', 'offer':offer})}, MemberId)
}


let createAnswer = async (offer) => {

  let localmeetingname = localStorage.getItem("localmeetingname");
  let localpersonname = localStorage.getItem("localpersonname");

  await createPeerConnection({localmeetingname:localmeetingname,localpersonname:localpersonname})

  await peerConnection.setRemoteDescription(offer)

  let answer = await peerConnection.createAnswer()
  await peerConnection.setLocalDescription(answer)

  socket.send(JSON.stringify({ 
    type: "answer", 
    data: { 
    meetingname: localmeetingname,
     personname: localpersonname,
     answer:answer
      }
     }));

 // client.sendMessageToPeer({text:JSON.stringify({'type':'answer', 'answer':answer})}, MemberId)
}


let addAnswer = async (answer) => {
  if(!peerConnection.currentRemoteDescription){
      peerConnection.setRemoteDescription(answer)
  }
}


let peerConnection3 = new RTCPeerConnection()
let localStream3;
let remoteStream3;

function App() {
  
  const [compstate, setCompstate] = useState({
    showui: true,

  });

  useEffect(() => {
   // getData();

   
  }, []);



  let getData = async (methodprops) => {
    localStream3 = await navigator.mediaDevices.getUserMedia({video:true, audio:false})
    remoteStream3 = new MediaStream()
    document.getElementById('user-1').srcObject = localStream3
    document.getElementById('user-2').srcObject = remoteStream3

    localStream3.getTracks().forEach((track) => {
        peerConnection3.addTrack(track, localStream);
    });

    peerConnection3.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
        remoteStream3.addTrack(track);
        });
    };
  }

  // let showui = async (methodprops) => {
  //   let compstatejs = JSON.parse(JSON.stringify(compstate));
  //   let methodpropsjs = JSON.parse(JSON.stringify(methodprops));

  //   await setCompstate({ ...compstatejs, ...methodpropsjs, showui: true });
  // };

  // let hideui = async (methodprops) => {
  //   let compstatejs = JSON.parse(JSON.stringify(compstate));
  //   let methodpropsjs = JSON.parse(JSON.stringify(methodprops));
  //   await setCompstate({ ...compstatejs, ...methodpropsjs, showui: false });
  // };

  let handleChange = async (methodprops) => {
    let { type, value } = methodprops;
   
    consolelog("handleChange",methodprops);
    if (type === "meetingname") {
      //   await showui({ "meetingname": value });
      localStorage.setItem("localmeetingname", value);
    }
    if (type === "personname") {
      // await showui({ "personname": value });
      localStorage.setItem("localpersonname", value);
    }
  }

  let handleClick = async (methodprops) => {
    let { type } = methodprops;
    
    consolelog("handleClick",methodprops);
    let localmeetingname = localStorage.getItem("localmeetingname");
    let localpersonname = localStorage.getItem("localpersonname");
    if (type === "createmeeting") {
      socket.send(JSON.stringify({ type: "createmeeting", data: { meetingname: localmeetingname, personname: localpersonname } }));
    }
    if (type === "deletemeeting") {
      socket.send(JSON.stringify({ type: "deletemeeting", data: { meetingname: localmeetingname, personname: localpersonname } }));
    }
    if (type === "joinmeeting") {
      socket.send(JSON.stringify({ type: "joinmeeting", data: { meetingname: localmeetingname, personname: localpersonname } }));
    }
    if (type === "quitmeeting") {
      socket.send(JSON.stringify({ type: "quitmeeting", data: { meetingname: localmeetingname, personname: localpersonname } }));
    }
    if (type === "showcameravideo") {
      showLocalStreamVideo();
    }

  }



  if (compstate.showui !== true) {
    return <></>;
  } else {
    return (
      <div>
        meetingname
        <input onChange={(e) =>
          handleChange({
            type: "meetingname",
            value: e.target.value,
          })
        }
          defaultValue={compstate.meetingname}
        />
        personname
        <input onChange={(e) =>
          handleChange({
            type: "personname",
            value: e.target.value,
          })
        }
          defaultValue={compstate.personname}
        />
        <div onClick={() => handleClick({ type: "createmeeting" })} >create</div>
        <div onClick={() => handleClick({ type: "deletemeeting" })} >delete</div>
        <div onClick={() => handleClick({ type: "joinmeeting" })} >Join</div>
        <div onClick={() => handleClick({ type: "quitmeeting" })} >quit</div>
        <div onClick={() => handleClick({ type: "showcameravideo" })} >showcameravideo</div>
        <div onClick={() => createOffer({ type: "makeCall" })} >createOffer</div>
        <div onClick={() => createAnswer({ type: "createAnswer" })} >createAnswer</div>
       
        

        <video  id="myscreenvideo" ></video>
        <video  id="remotescreenvideo" autoplay playsinline ></video>
      
      

    <video class="video-player" id="user-1" autoplay playsinline></video>
        <video class="video-player" id="user-2" autoplay playsinline></video>
      
       
       
      </div>

    );
  }
}

export default App;