import "./App.css";
import React, { useState, useEffect, useRef } from "react";
let socket = new WebSocket(
  "wss://s8239.nyc1.piesocket.com/v3/1?api_key=eWE09fv3RllnW6tVNzfP85M4rCn6ckxRQfHLP4aX&notify_self=1"
);


const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
};

let localmeetingname = sessionStorage.getItem("localmeetingname");
let localpersonname = sessionStorage.getItem("localpersonname");


let peerConnectionsArray = [];



let socketsend = function (str) {
  consolelog("socketsend", str);
 
  socket.send(JSON.stringify(str));
};

socket.onopen = function (e) {
  consolelog("[open] Connection established");
  consolelog("Sending to server");
  //socket.send("My name is John");
};

socket.onmessage = function (event) {
  let datafromserver = JSON.parse(event.data);
  let { answer, meetingname, personname, remotepersonname } = datafromserver.data;
 
 
  consolelog("localpersonname", localpersonname);
  consolelog("personname", personname);
  if (localpersonname !== personname && localpersonname == remotepersonname) {
    consolelog("onmessageevent", event);
    consolelog("datafromserver", datafromserver);

    if (datafromserver && datafromserver.type === "createmeeting") {
      createMeeting(datafromserver);
    }
    if (datafromserver && datafromserver.type === "deletemeeting") {
      deleteMeeting(datafromserver);
    }

    if (datafromserver && datafromserver.type === "joinmeeting") {
      joinMeeting(datafromserver);
    }
    if (datafromserver && datafromserver.type === "quitmeeting") {
      quitMeeting(datafromserver);
    }
    if (
      datafromserver &&
      datafromserver.type === "createofferresult" &&
      datafromserver.data.createofferresult
    ) {
      createAnswerHandler({remotepersonname : personname,createofferresult:datafromserver.data.createofferresult});
    }
    if (datafromserver 
      && datafromserver.type === "createanswerresult"
      && datafromserver.data.createanswerresult
      ) {
      addAnswerHandler({remotepersonname:personname,createanswerresult:datafromserver.data.createanswerresult});
    }
  
  }
};

socket.onclose = function (event) {
  if (event.wasClean) {
    consolelog(
      `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
    );
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    consolelog("[close] Connection died");
  }
};

socket.onerror = function (error) {
  consolelog(`[error]`);
};

let consolelog = (a, b) => {
  console.log(a);
  console.log(b);
};

let createMeeting = async (methodprops) => {
  consolelog("createMeeting", methodprops);
  let { meetingname, personname } = methodprops.data;
  let meetingsdata = sessionStorage.getItem("meetings");
  let meetingsdatajson = [];
  if (meetingsdata) {
    meetingsdatajson = JSON.parse(meetingsdata);
  }

  
  let ismeetingalreadyexists = false;
  if (meetingsdatajson && meetingsdatajson.length > 0) {
    consolelog("meetingsdatajson", meetingsdatajson);
    for (let i = 0; i < meetingsdatajson.length; i++) {
      consolelog("meetingsdatajson[i].name", meetingsdatajson[i].name);
      consolelog("meetingname", meetingname);
      if (meetingsdatajson[i].name === meetingname) {
        ismeetingalreadyexists = true;
      }
    }
  }




  if (ismeetingalreadyexists === true && localpersonname === personname) {
    alert("meeting already exists");
  } else if (
    ismeetingalreadyexists === true &&
    localpersonname !== personname
  ) {
  } else {
    if (meetingsdatajson && meetingsdatajson.length > 0) {
    } else {
      meetingsdatajson = [];
    }
    let newmeeting = { name: meetingname };
    meetingsdatajson.push(newmeeting);
    consolelog("meetingsdatajson", meetingsdatajson);
    sessionStorage.setItem("meetings", JSON.stringify(meetingsdatajson));
  }
};
let deleteMeeting = async (methodprops) => {
  consolelog("deleteMeeting", methodprops);
  let { meetingname, personname } = methodprops.data;
  let meetingsdata = sessionStorage.getItem("meetings");
  let meetingsdatajson = [];
  let meetingsdatajsonU = [];
  if (meetingsdata) {
    meetingsdatajson = JSON.parse(meetingsdata);
  }


  let ismeetingalreadyexists = false;
  if (meetingsdatajson && meetingsdatajson.length > 0) {
    consolelog("meetingsdatajson", meetingsdatajson);
    for (let i = 0; i < meetingsdatajson.length; i++) {
      consolelog("meetingsdatajson[i].name", meetingsdatajson[i].name);
      consolelog("meetingname", meetingname);
      if (meetingsdatajson[i].name === meetingname) {
        ismeetingalreadyexists = true;
      } else {
        meetingsdatajsonU.push(meetingsdatajson[i]);
      }
    }
  }



  if (ismeetingalreadyexists === false && localpersonname === personname) {
    alert("meeting not exists");
  } else if (
    ismeetingalreadyexists === false &&
    localpersonname !== personname
  ) {
  } else {
    sessionStorage.setItem("meetings", JSON.stringify(meetingsdatajsonU));
  }
};
let joinMeeting = async (methodprops) => {
  consolelog("joinMeeting", methodprops);
  let { meetingname, personname } = methodprops.data;
  let meetingsdata = sessionStorage.getItem("meetings");
  let meetingsdatajson = [];
  if (meetingsdata) {
    meetingsdatajson = JSON.parse(meetingsdata);
  }

  let meetingjoineesdata = sessionStorage.getItem("meetingjoinees");
  let meetingjoineesdatajson = [];
  if (meetingjoineesdata) {
    meetingjoineesdatajson = JSON.parse(meetingjoineesdata);
  }

  let meetingpeerconnectionsdata = sessionStorage.getItem(
    "meetingpeerconnections"
  );
  let meetingpeerconnectionsdatajson = [];
  if (meetingpeerconnectionsdata) {
    meetingpeerconnectionsdatajson = JSON.parse(meetingpeerconnectionsdata);
  }


  let ismeetingalreadyexists = false;
  let ismeetingjoineealreadyexists = false;
  if (meetingsdatajson && meetingsdatajson.length > 0) {
    consolelog("meetingsdatajson", meetingsdatajson);
    for (let i = 0; i < meetingsdatajson.length; i++) {
      consolelog("meetingsdatajson[i].name", meetingsdatajson[i].name);
      consolelog("meetingname", meetingname);
      if (meetingsdatajson[i].name === meetingname) {
        ismeetingalreadyexists = true;
      }
    }
  }

  if (meetingjoineesdatajson && meetingjoineesdatajson.length > 0) {
    consolelog("meetingjoineesdatajson", meetingjoineesdatajson);
    for (let i = 0; i < meetingjoineesdatajson.length; i++) {
      consolelog(
        "meetingjoineesdatajson[i].name",
        meetingjoineesdatajson[i].name
      );
      consolelog("meetingname", meetingname);
      if (
        meetingjoineesdatajson[i].meetingname === meetingname &&
        meetingjoineesdatajson[i].name === personname
      ) {
        ismeetingjoineealreadyexists = true;
      }
      if (
        meetingjoineesdatajson[i].meetingname === meetingname &&
        meetingjoineesdatajson[i].name !== personname
      ) {
        let newmeetingpeerconnection = {
          requestfromname: personname,
          requesttoname: meetingjoineesdatajson[i].name,
          meetingname: meetingname,
        };

        meetingpeerconnectionsdatajson.push(newmeetingpeerconnection);
      }
    }
  }

  

  if (ismeetingalreadyexists === false && localpersonname === personname) {
    alert("meeting not exists");
  } else if (
    ismeetingalreadyexists === false &&
    localpersonname !== personname
  ) {
  } else if (
    ismeetingjoineealreadyexists === true &&
    localpersonname === personname
  ) {
    alert("meeting joinee already exists");
  } else if (
    ismeetingjoineealreadyexists === true &&
    localpersonname !== personname
  ) {
  } else {
    if (meetingjoineesdatajson && meetingjoineesdatajson.length > 0) {
    } else {
      meetingjoineesdatajson = [];
    }
    let newmeetingjoinee = { name: personname, meetingname: meetingname };
    meetingjoineesdatajson.push(newmeetingjoinee);
    consolelog("meetingjoineesdatajson", meetingjoineesdatajson);
    sessionStorage.setItem(
      "meetingjoinees",
      JSON.stringify(meetingjoineesdatajson)
    );
    if (
      meetingpeerconnectionsdatajson &&
      meetingpeerconnectionsdatajson.length > 0
    ) {
      sessionStorage.setItem(
        "meetingpeerconnections",
        JSON.stringify(meetingpeerconnectionsdatajson)
      );
    }

    await resetPeerConnections();
  }
};
let quitMeeting = async (methodprops) => {
  consolelog("quitMeeting", methodprops);
  let { meetingname, personname } = methodprops.data;
  let meetingsdata = sessionStorage.getItem("meetings");
  let meetingsdatajson = [];
  if (meetingsdata) {
    meetingsdatajson = JSON.parse(meetingsdata);
  }

  let meetingjoineesdata = sessionStorage.getItem("meetingjoinees");
  let meetingjoineesdatajson = [];
  let meetingjoineesdatajsonU = [];
  if (meetingjoineesdata) {
    meetingjoineesdatajson = JSON.parse(meetingjoineesdata);
  }

  let meetingpeerconnectionsdata = sessionStorage.getItem(
    "meetingpeerconnections"
  );
  let meetingpeerconnectionsdatajson = [];
  let meetingpeerconnectionsdatajsonU = [];
  if (meetingpeerconnectionsdata) {
    meetingpeerconnectionsdatajson = JSON.parse(meetingpeerconnectionsdata);
  }


  let ismeetingalreadyexists = false;
  let ismeetingjoineealreadyexists = false;
  if (meetingsdatajson && meetingsdatajson.length > 0) {
    consolelog("meetingsdatajson", meetingsdatajson);
    for (let i = 0; i < meetingsdatajson.length; i++) {
      consolelog("meetingsdatajson[i].name", meetingsdatajson[i].name);
      consolelog("meetingname", meetingname);
      if (meetingsdatajson[i].name === meetingname) {
        ismeetingalreadyexists = true;
      }
    }
  }

  if (meetingjoineesdatajson && meetingjoineesdatajson.length > 0) {
    consolelog("meetingjoineesdatajson", meetingjoineesdatajson);
    for (let i = 0; i < meetingjoineesdatajson.length; i++) {
      consolelog(
        "meetingjoineesdatajson[i].name",
        meetingjoineesdatajson[i].name
      );
      consolelog("meetingname", meetingname);
      if (
        meetingjoineesdatajson[i].meetingname === meetingname &&
        meetingjoineesdatajson[i].name === personname
      ) {
        ismeetingjoineealreadyexists = true;
      } else {
        meetingjoineesdatajsonU.push(meetingjoineesdatajson[i]);
      }
    }
  }

  if (
    meetingpeerconnectionsdatajson &&
    meetingpeerconnectionsdatajson.length > 0
  ) {
    consolelog(
      "meetingpeerconnectionsdatajson",
      meetingpeerconnectionsdatajson
    );
    for (let i = 0; i < meetingpeerconnectionsdatajson.length; i++) {
      consolelog(
        "meetingpeerconnectionsdatajson[i].name",
        meetingpeerconnectionsdatajson[i].name
      );
      consolelog("meetingname", meetingname);
      if (
        meetingpeerconnectionsdatajson[i].meetingname === meetingname &&
        (meetingpeerconnectionsdatajson[i].requestfromname === personname ||
          meetingpeerconnectionsdatajson[i].requesttoname === personname)
      ) {
      } else {
        meetingpeerconnectionsdatajsonU.push(meetingpeerconnectionsdatajson[i]);
      }
    }
  }



  if (ismeetingalreadyexists === false && localpersonname === personname) {
    alert("meeting not exists");
  } else if (
    ismeetingalreadyexists === false &&
    localpersonname !== personname
  ) {
  } else if (
    ismeetingjoineealreadyexists === false &&
    localpersonname === personname
  ) {
    alert("meeting joinee not exists");
  } else if (
    ismeetingjoineealreadyexists === false &&
    localpersonname !== personname
  ) {
  } else {
    consolelog("meetingjoineesdatajsonU", meetingjoineesdatajsonU);
    sessionStorage.setItem(
      "meetingjoinees",
      JSON.stringify(meetingjoineesdatajsonU)
    );
    if (meetingpeerconnectionsdatajsonU.length > 0) {
      sessionStorage.setItem(
        "meetingpeerconnections",
        JSON.stringify(meetingpeerconnectionsdatajsonU)
      );
    }
  }
};


let resetPeerConnections = async (methodprops) => {
  consolelog("resetPeerConnections", methodprops);

  let meetingjoineesdata = sessionStorage.getItem("meetingjoinees");
  let meetingjoineesdatajson = [];
  if (meetingjoineesdata) {
    meetingjoineesdatajson = JSON.parse(meetingjoineesdata);
  }

  let meetingpeerconnectionsdata = sessionStorage.getItem(
    "meetingpeerconnections"
  );
  let meetingpeerconnectionsdatajson = [];
  if (meetingpeerconnectionsdata) {
    meetingpeerconnectionsdatajson = JSON.parse(meetingpeerconnectionsdata);
  }
};

let closecall = async (remotepersonname) => {
 
  if (peerConnectionsArray && peerConnectionsArray.length > 0) {
    for (let i =0;i<peerConnectionsArray.length;i++) {
    if(peerConnectionsArray[i].remotepersonname == remotepersonname && peerConnectionsArray[i].pc){
      await peerConnectionsArray[i].pc.close();
    }
    }
  } 
};

let makecall = async (methodprops) => {
  consolelog(methodprops);
  let {remotepersonname} = methodprops;
  let newpeerconnectionobj = {
    localmeetingname: localmeetingname,
    localpersonname: localpersonname,
    remotepersonname:remotepersonname
  };
     
  if (peerConnectionsArray && peerConnectionsArray.length > 0) {
    peerConnectionsArray.push(newpeerconnectionobj);
  } else {
    peerConnectionsArray = [];
    peerConnectionsArray.push(newpeerconnectionobj);
  }
  await createOfferHandler({remotepersonname:remotepersonname});
};



let createOfferHandler = async (methodprops) => {
  consolelog("createOfferHandler",methodprops);
  let {remotepersonname} = methodprops;
  consolelog("peerConnectionsArray", peerConnectionsArray);
 
    for (let i =0;i<peerConnectionsArray.length;i++) {
    if(peerConnectionsArray[i].remotepersonname == remotepersonname){
    let pc = new RTCPeerConnection(servers);
    let localStreamObj;
    let remoteStreamObj;
    peerConnectionsArray[i].pc = pc;
    peerConnectionsArray[i].localStreamObj = localStreamObj;
    peerConnectionsArray[i].remoteStreamObj = remoteStreamObj;

    localStreamObj = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    remoteStreamObj = new MediaStream();

    try {
      let myscreenvideo = document.getElementById("myscreenvideo");
      myscreenvideo.srcObject = localStreamObj;
      myscreenvideo.muted = true;
      myscreenvideo.play();

      let myscreen2video = document.getElementById("remotescreenvideo"+remotepersonname);
      myscreen2video.srcObject = remoteStreamObj;
      myscreen2video.muted = true;
      myscreen2video.play();
    } catch (err) {
      console.log(err);
    }

    localStreamObj.getTracks().forEach((track) => {
      peerConnectionsArray[i].pc.addTrack(track, localStreamObj);
    });

    peerConnectionsArray[i].pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStreamObj.addTrack(track);
      });
    };
  }
  }

  consolelog("peerConnectionsArray", peerConnectionsArray);

  for (let i =0;i<peerConnectionsArray.length;i++) {
    if(peerConnectionsArray[i].remotepersonname == remotepersonname){
    let pcobj = peerConnectionsArray[i];

    peerConnectionsArray[i].pc.onicecandidate = async (event) => {
      consolelog("pcobjonicecandidate", peerConnectionsArray[i]);
      consolelog("onicecandidate", event);
      //Event that fires off when a new offer ICE candidate is created
      if (event.candidate) {
       

        sessionStorage.setItem(
          "createofferresult"+remotepersonname,
          JSON.stringify(peerConnectionsArray[i].pc.localDescription)
        );
      }
    };
    consolelog("pcobj", peerConnectionsArray[i]);
    const offer3 = await peerConnectionsArray[i].pc.createOffer();
    consolelog("pcobj", peerConnectionsArray[i]);
    await peerConnectionsArray[i].pc.setLocalDescription(offer3);
  }
}

  setTimeout(() => {
    socketsend({
      type: "createofferresult",
      data: {
        meetingname: localmeetingname,
        personname: localpersonname,
        remotepersonname:remotepersonname,
        createofferresult: JSON.parse(
          sessionStorage.getItem("createofferresult"+remotepersonname)
        ),
      },
    });
  }, 3000);
};

let createAnswerHandler = async (methodprops) => {
  consolelog("createAnswerHandler",methodprops);
  let {remotepersonname,createofferresult} = methodprops;
  let offer3 = {};
 
  if (createofferresult) {
    offer3 = createofferresult;
  }

  let newpeerconnectionobj = {
    localmeetingname: localmeetingname,
    localpersonname: localpersonname,
    remotepersonname:remotepersonname
  };


  if (peerConnectionsArray && peerConnectionsArray.length > 0) {
    peerConnectionsArray.push(newpeerconnectionobj);
  } else {
    peerConnectionsArray = [];
    peerConnectionsArray.push(newpeerconnectionobj);
  }

  for (let i =0;i<peerConnectionsArray.length;i++) {
    if(peerConnectionsArray[i].remotepersonname == remotepersonname){
    let pc = new RTCPeerConnection(servers);
    let localStreamObj;
    let remoteStreamObj;
    peerConnectionsArray[i].pc = pc;
    peerConnectionsArray[i].localStreamObj = localStreamObj;
    peerConnectionsArray[i].remoteStreamObj = remoteStreamObj;

    localStreamObj = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    remoteStreamObj = new MediaStream();

    try {
      let myscreenvideo = document.getElementById("myscreenvideo");
      myscreenvideo.srcObject = localStreamObj;
      myscreenvideo.muted = true;
      myscreenvideo.play();
    } catch (err) {
      console.log(err);
    }

    try {
      let myscreen2video = document.getElementById("remotescreenvideo"+remotepersonname);
      myscreen2video.srcObject = remoteStreamObj;
      myscreen2video.muted = true;
      myscreen2video.play();
    } catch (err) {
      console.log(err);
    }

    localStreamObj.getTracks().forEach((track) => {
      peerConnectionsArray[i].pc.addTrack(track, localStreamObj);
    });

    peerConnectionsArray[i].pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStreamObj.addTrack(track);
      });
    };
  }
}


for (let i =0;i<peerConnectionsArray.length;i++) {
  if(peerConnectionsArray[i].remotepersonname == remotepersonname){
    peerConnectionsArray[i].pc.onicecandidate = async (event) => {
      //Event that fires off when a new answer ICE candidate is created
      if (event.candidate) {
        console.log("Adding answer candidate...:", event.candidate);
        
        sessionStorage.setItem(
          "createanswerresult"+remotepersonname,
          JSON.stringify(peerConnectionsArray[i].pc.localDescription)
        );
      }
    };

    await peerConnectionsArray[i].pc.setRemoteDescription(offer3);

    let answer3 = await peerConnectionsArray[i].pc.createAnswer();
    try {
      await peerConnectionsArray[i].pc.setLocalDescription(answer3);
    } catch (err) {
      console.log(err);
    }
  }
  }

  setTimeout(() => {
    socketsend({
      type: "createanswerresult",
      data: {
        meetingname: localmeetingname,
        personname: localpersonname,
        remotepersonname:remotepersonname,
        createanswerresult: JSON.parse(
          sessionStorage.getItem("createanswerresult"+remotepersonname)
        ),
      },
    });
  }, 3000);
};

let addAnswerHandler = async (methodprops) => {
  consolelog("addAnswerHandler",methodprops);
  let {remotepersonname,createanswerresult} = methodprops;
  let answer3 = {};

  if (createanswerresult) {
    answer3 = createanswerresult;
  }

  console.log("answer:", answer3);
  for (let i =0;i<peerConnectionsArray.length;i++) {
    if(peerConnectionsArray[i].remotepersonname == remotepersonname){
    // (!peerConnectionsArray[i].pc.currentRemoteDescription){
    setTimeout(() => {
      try {
        peerConnectionsArray[i].pc.setRemoteDescription(answer3);
      } catch (err) {
        console.log(err);
      }
    }, 1000);

  } 
  }
};

function App() {
  const [compstate, setCompstate] = useState({
    showui: true,
    calltopersonnames:[]
  });

  useEffect(() => {
    // getData();
  }, []);

  let getData = async (methodprops) => {};

  let showui = async (methodprops) => {
    let compstatejs = JSON.parse(JSON.stringify(compstate));
    let methodpropsjs = JSON.parse(JSON.stringify(methodprops));

    await setCompstate({ ...compstatejs, ...methodpropsjs, showui: true });
  };

  let hideui = async (methodprops) => {
    let compstatejs = JSON.parse(JSON.stringify(compstate));
    let methodpropsjs = JSON.parse(JSON.stringify(methodprops));
    await setCompstate({ ...compstatejs, ...methodpropsjs, showui: false });
  };

  let handleChange = async (methodprops) => {
    let { type, value } = methodprops;

    consolelog("handleChange", methodprops);
    if (type === "meetingname") {
      //   await showui({ "meetingname": value });
      sessionStorage.setItem("localmeetingname", value);
    }
    if (type === "personname") {
      // await showui({ "personname": value });
      sessionStorage.setItem("localpersonname", value);
    }
    if (type === "remotepersonname") {
      // await showui({ "personname": value });
    
      await showui({ remotepersonname: value });
    }
    
  };

  let handleClick = async (methodprops) => {
    let { type } = methodprops;
  let {calltopersonnames, remotepersonname} = compstate;
    consolelog("handleClick", methodprops);
   
    
    if (type === "addtocalltopersonnames") {
      calltopersonnames.push(remotepersonname);
      await hideui({});
      await showui({ calltopersonnames: calltopersonnames });
    }
    if (type === "removefromcalltopersonnames") {
      let calltopersonnamesU = [];
      for(let i=0; i<calltopersonnames.length; i++){
        if(calltopersonnames[i] != remotepersonname){
          calltopersonnamesU.push(calltopersonnames[i]);
        }
      }
     
      await hideui({});
      await showui({ calltopersonnames: calltopersonnamesU });
    }
    
    if (type === "createmeeting") {
      socketsend({
        type: "createmeeting",
        data: { meetingname: localmeetingname, personname: localpersonname },
      });
    }
    if (type === "deletemeeting") {
      socketsend({
        type: "deletemeeting",
        data: { meetingname: localmeetingname, personname: localpersonname },
      });
    }
    if (type === "joinmeeting") {
      socketsend({
        type: "joinmeeting",
        data: { meetingname: localmeetingname, personname: localpersonname },
      });
    }
    if (type === "quitmeeting") {
      socketsend({
        type: "quitmeeting",
        data: { meetingname: localmeetingname, personname: localpersonname },
      });
    }
    if (type === "showcameravideo") {
    }
  };

  let {calltopersonnames, remotepersonname} = compstate;
  let calltopersonnamesHtml = [];
  for(let i=0; i<calltopersonnames.length; i++){
    let videoid = "remotescreenvideo"+calltopersonnames[i];
    calltopersonnamesHtml.push(<div><div>{calltopersonnames[i]}</div> <video class="video-player" id={videoid} ></video></div>);
  }
  if (compstate.showui !== true) {
    return <></>;
  } else {
    return (
      <div>
        meetingname
        <input
          onChange={(e) =>
            handleChange({
              type: "meetingname",
              value: e.target.value,
            })
          }
          defaultValue={compstate.meetingname}
        />
        personname
        <input
          onChange={(e) =>
            handleChange({
              type: "personname",
              value: e.target.value,
            })
          }
          defaultValue={compstate.personname}
        />

     remotepersonname
        <input
          onChange={(e) =>
            handleChange({
              type: "remotepersonname",
              value: e.target.value,
            })
          }
          defaultValue={compstate.remotepersonname}
        />
         <div onClick={() => handleClick({ type: "addtocalltopersonnames" })}>Add to calltopersonnames</div>
         <div onClick={() => handleClick({ type: "removefromcalltopersonnames" })}>remove from calltopersonnames</div>
        <div onClick={() => handleClick({ type: "createmeeting" })}>create</div>
        <div onClick={() => handleClick({ type: "deletemeeting" })}>delete</div>
        <div onClick={() => handleClick({ type: "joinmeeting" })}>Join</div>
        <div onClick={() => handleClick({ type: "quitmeeting" })}>quit</div>
        <div onClick={() => handleClick({ type: "showcameravideo" })}>
          showcameravideo
        </div>
        <video class="video-player" id="myscreenvideo"></video>
       
        {calltopersonnamesHtml}
        <div class="step">
          <p>
            <strong>Step 1:</strong> User 1, click "Create offer" to generate
            SDP offer and copy offer from text area below.
          </p>
          <button
            id="create-offer"
            onClick={() => makecall({ type: "createAnswer", remotepersonname:remotepersonname })}
          >
            Create Offer
          </button>
          <button
            id="create-offer"
            onClick={() => closecall({ type: "createAnswer" })}
          >
            closecall
          </button>
        </div>
       
       
      </div>
    );
  }
}

export default App;
