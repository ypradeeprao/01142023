
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
    (datafromserver.type === "createofferresult") &&
    datafromserver.data.createofferresult
  ) {
    createAnswer3(datafromserver.data.createofferresult);
  }
  if (datafromserver &&
    (datafromserver.type === "createanswerresult")
  ) {
    addAnswer3(datafromserver.data.createanswerresult);
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


let peerConnection3 = new RTCPeerConnection(servers)
let localStream3;
let remoteStream3;
let localmeetingname3 = localStorage.getItem("localmeetingname");
let localpersonname3 = localStorage.getItem("localpersonname");
let remotepersonname = localStorage.getItem("remotepersonname");

let peerConnectionsObj ={};

let createOffer4 = async () => {
  let newpeerconnectionobj = {
  localmeetingname : localmeetingname3,
 localpersonname : localpersonname3
  };
if(peerConnectionsObj && Object.keys(peerConnectionsObj).length > 0){
  peerConnectionsObj["remotepersonname"] = newpeerconnectionobj;
}
else{
  peerConnectionsObj = {};
  peerConnectionsObj["remotepersonname"] = newpeerconnectionobj;
}
 await createOffer3();
}
let createOffer3 = async () => {
  consolelog("peerConnectionsObj",peerConnectionsObj);
  for(let i in peerConnectionsObj){
    let pc = new RTCPeerConnection(servers)
    let localStreamObj;
    let remoteStreamObj;
    peerConnectionsObj[i].pc = pc;
    peerConnectionsObj[i].localStreamObj = localStreamObj;
    peerConnectionsObj[i].remoteStreamObj = remoteStreamObj;
   
    localStreamObj = await navigator.mediaDevices.getUserMedia({video:true, audio:false});
    remoteStreamObj = new MediaStream();

   
  
    try{

      let myscreenvideo =  document.getElementById('user-1');
      myscreenvideo.srcObject = localStreamObj;
      myscreenvideo.play();

    let myscreen2video =  document.getElementById('user-2');
    myscreen2video.srcObject = remoteStreamObj;
    myscreen2video.play();
    }
    catch (err) {
      console.log(err);
    }

  
    localStreamObj.getTracks().forEach((track) => {
      peerConnectionsObj[i].pc.addTrack(track, localStreamObj);
  });



  peerConnectionsObj[i].pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStreamObj.addTrack(track);
      });
  };

    }

    consolelog("peerConnectionsObj",peerConnectionsObj);

 for(let i in peerConnectionsObj){
  let pcobj = peerConnectionsObj[i];
 
  peerConnectionsObj[i].pc.onicecandidate = async (event) => {
    consolelog("pcobjonicecandidate",peerConnectionsObj[i]);
    consolelog("onicecandidate",event);
      //Event that fires off when a new offer ICE candidate is created
      if(event.candidate){
          document.getElementById('offer-sdp').value =  JSON.stringify(peerConnectionsObj[i].pc.localDescription);
      
          localStorage.setItem("createofferresult",  JSON.stringify(peerConnectionsObj[i].pc.localDescription));

          setTimeout(() => {
           
          socket.send(JSON.stringify({ 
            type: "createofferresult", 
            data: { 
            meetingname: peerConnectionsObj[i].localmeetingname,
             personname: peerConnectionsObj[i].localpersonname,
             createofferresult:JSON.parse(localStorage.getItem("createofferresult"))
              }
             }));
          }, 1000);


      }
  };
  consolelog("pcobj",peerConnectionsObj[i]);
  const offer3 = await peerConnectionsObj[i].pc.createOffer();
  consolelog("pcobj",peerConnectionsObj[i]);
  await peerConnectionsObj[i].pc.setLocalDescription(offer3);
  }
}

let createAnswer3 = async (createofferresult) => {

  let offer3 = {};
  if(document.getElementById('offer-sdp').value){
    offer3 = JSON.parse(document.getElementById('offer-sdp').value)
  }
if(createofferresult){
  offer3 = createofferresult;
}

let newpeerconnectionobj = {
  localmeetingname : localmeetingname3,
 localpersonname : localpersonname3
  };
if(peerConnectionsObj && Object.keys(peerConnectionsObj).length > 0){
  peerConnectionsObj["remotepersonname"] = newpeerconnectionobj;
}
else{
  peerConnectionsObj = {};
  peerConnectionsObj["remotepersonname"] = newpeerconnectionobj;
}


for(let i in peerConnectionsObj){
  let pc = new RTCPeerConnection(servers)
  let localStreamObj;
  let remoteStreamObj;
  peerConnectionsObj[i].pc = pc;
  peerConnectionsObj[i].localStreamObj = localStreamObj;
  peerConnectionsObj[i].remoteStreamObj = remoteStreamObj;
 
  localStreamObj = await navigator.mediaDevices.getUserMedia({video:true, audio:false});
  remoteStreamObj = new MediaStream();



  try{

    let myscreenvideo =  document.getElementById('user-1');
    myscreenvideo.srcObject = localStreamObj;
    myscreenvideo.play();

  
  }
  catch (err) {
    console.log(err);
  }

  try{

  

  let myscreen2video =  document.getElementById('user-2');
  myscreen2video.srcObject = remoteStreamObj;
  myscreen2video.play();
  }
  catch (err) {
    console.log(err);
  }


  localStreamObj.getTracks().forEach((track) => {
    peerConnectionsObj[i].pc.addTrack(track, localStreamObj);
});



peerConnectionsObj[i].pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStreamObj.addTrack(track);
    });
};

  }



for(let i in peerConnectionsObj){
  peerConnectionsObj[i].pc.onicecandidate = async (event) => {
      //Event that fires off when a new answer ICE candidate is created
      if(event.candidate){
          console.log('Adding answer candidate...:', event.candidate)
          document.getElementById('answer-sdp').value = JSON.stringify( peerConnectionsObj[i].pc.localDescription)
          localStorage.setItem("createanswerresult",  JSON.stringify(peerConnectionsObj[i].pc.localDescription));
          setTimeout(() => {
          socket.send(JSON.stringify({ 
            type: "createanswerresult", 
            data: { 
            meetingname: localmeetingname3,
             personname: localpersonname3,
             createanswerresult:JSON.parse(localStorage.getItem("createanswerresult"))
              }
             }));
            }, 1000);
        }
  };

  await  peerConnectionsObj[i].pc.setRemoteDescription(offer3);

  let answer3 = await  peerConnectionsObj[i].pc.createAnswer();
  try {
  await  peerConnectionsObj[i].pc.setLocalDescription(answer3); 
} catch (err) {
  console.log(err);
}

}
}

let addAnswer3 = async (createanswerresult) => {
  console.log('Add answer triggerd')
  let answer3 = {};
  if(document.getElementById('answer-sdp').value){
    answer3 = JSON.parse(document.getElementById('answer-sdp').value)
  }
if(createanswerresult){
  answer3 = createanswerresult;
}
  
  console.log('answer:', answer3)
  for(let i in peerConnectionsObj){
  // (!peerConnectionsObj[i].pc.currentRemoteDescription){
    setTimeout(() => {
    try {
      peerConnectionsObj[i].pc.setRemoteDescription(answer3);
    } catch (err) {
      console.log(err);
    }
  }, 1000);

    //  let myscreen2video =  document.getElementById('user-2');
   
   // myscreen2video.play();
 // }
}
}


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
    //document.getElementById('user-1').srcObject = localStream3
    let myscreenvideo =  document.getElementById('user-1');
  myscreenvideo.srcObject = localStream3;
  myscreenvideo.play();

  let myscreen2video =  document.getElementById('user-2');
  myscreen2video.srcObject = remoteStream3;
  myscreen2video.play();

    //document.getElementById('user-2').srcObject = remoteStream3

    localStream3.getTracks().forEach((track) => {
        peerConnection3.addTrack(track, localStream3);
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
        <div onClick={() => createOffer4({ type: "makeCall" })} >createOffer</div>
        <div onClick={() => createAnswer({ type: "createAnswer" })} >createAnswer</div>
       
        

        <video  id="myscreenvideo" ></video>
        <video  id="remotescreenvideo" autoplay playsinline ></video>
      
      

    <video class="video-player" id="user-1" ></video>
        <video class="video-player" id="user-2" ></video>
      
       

        <div class="step">
        <p><strong>Step 1:</strong> User 1,  click "Create offer" to generate SDP offer and copy offer from text area below.</p>
        <button id="create-offer" onClick={() => createOffer4({ type: "createAnswer" })} >Create Offer</button>
    </div>

    <label>SDP OFFER:</label>
    <textarea id="offer-sdp" placeholder='User 2, paste SDP offer here...'></textarea>

    <div class="step">
        <p><strong>Step 2:</strong> User 2, paste SDP offer generated by user 1 into text area above, then  click "Create Answer" to generate SDP answer and copy the answer from the text area below.</p>
        <button id="create-answer" onClick={() => createAnswer3({ type: "createAnswer" })} >Create answer</button>
    </div>


    <label>SDP Answer:</label>
    <textarea id="answer-sdp" placeholder="User 1, paste SDP answer here..."></textarea>

    <div class="step">
        <p><strong>Step 3:</strong> User 1, paste SDP offer generated by user 2 into text area above and then click "Add Answer"</p>
        <button id="add-answer" onClick={() => addAnswer3({ type: "createAnswer" })} >Add answer</button>
    </div>



       
      </div>

    );
  }
}

export default App;