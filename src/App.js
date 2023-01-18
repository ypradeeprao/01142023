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


let peerConnectionsObj = {};



let socketsend = function (str) {
  consolelog("socketsend", str);
  str.data.remotepersonname = sessionStorage.getItem("localremotepersonname");
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
      createAnswerHandler(datafromserver.data.createofferresult);
    }
    if (datafromserver 
      && datafromserver.type === "createanswerresult"
      && datafromserver.data.createanswerresult
      ) {
      addAnswerHandler(datafromserver.data.createanswerresult);
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

let makecall = async () => {
  let newpeerconnectionobj = {
    localmeetingname: localmeetingname,
    localpersonname: localpersonname,
  };
     
  if (peerConnectionsObj && Object.keys(peerConnectionsObj).length > 0) {
    peerConnectionsObj[sessionStorage.getItem("localremotepersonname")] = newpeerconnectionobj;
  } else {
    peerConnectionsObj = {};
    peerConnectionsObj[sessionStorage.getItem("localremotepersonname")] = newpeerconnectionobj;
  }
  await createOfferHandler();
};

let closecall = async () => {
 
  if (peerConnectionsObj && Object.keys(peerConnectionsObj).length > 0) {
    for (let i in peerConnectionsObj) {
    if(i == sessionStorage.getItem("localremotepersonname") && peerConnectionsObj[i].pc){
      await peerConnectionsObj[i].pc.close();
    }
    }
  } 
};

let createOfferHandler = async () => {
  consolelog("peerConnectionsObj", peerConnectionsObj);
  for (let i in peerConnectionsObj) {
    let pc = new RTCPeerConnection(servers);
    let localStreamObj;
    let remoteStreamObj;
    peerConnectionsObj[i].pc = pc;
    peerConnectionsObj[i].localStreamObj = localStreamObj;
    peerConnectionsObj[i].remoteStreamObj = remoteStreamObj;

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

      let myscreen2video = document.getElementById("remotescreenvideo"+sessionStorage.getItem("localremotepersonname"));
      myscreen2video.srcObject = remoteStreamObj;
      myscreen2video.muted = true;
      myscreen2video.play();
    } catch (err) {
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

  consolelog("peerConnectionsObj", peerConnectionsObj);

  for (let i in peerConnectionsObj) {
    let pcobj = peerConnectionsObj[i];

    peerConnectionsObj[i].pc.onicecandidate = async (event) => {
      consolelog("pcobjonicecandidate", peerConnectionsObj[i]);
      consolelog("onicecandidate", event);
      //Event that fires off when a new offer ICE candidate is created
      if (event.candidate) {
       

        sessionStorage.setItem(
          "createofferresult",
          JSON.stringify(peerConnectionsObj[i].pc.localDescription)
        );
      }
    };
    consolelog("pcobj", peerConnectionsObj[i]);
    const offer3 = await peerConnectionsObj[i].pc.createOffer();
    consolelog("pcobj", peerConnectionsObj[i]);
    await peerConnectionsObj[i].pc.setLocalDescription(offer3);
  }

  setTimeout(() => {
    socketsend({
      type: "createofferresult",
      data: {
        meetingname: localmeetingname,
        personname: localpersonname,
        createofferresult: JSON.parse(
          sessionStorage.getItem("createofferresult")
        ),
      },
    });
  }, 3000);
};

let createAnswerHandler = async (createofferresult) => {
  let offer3 = {};
 
  if (createofferresult) {
    offer3 = createofferresult;
  }

  let newpeerconnectionobj = {
    localmeetingname: localmeetingname,
    localpersonname: localpersonname,
  };
  if (peerConnectionsObj && Object.keys(peerConnectionsObj).length > 0) {
    peerConnectionsObj["remotepersonname"] = newpeerconnectionobj;
  } else {
    peerConnectionsObj = {};
    peerConnectionsObj["remotepersonname"] = newpeerconnectionobj;
  }

  for (let i in peerConnectionsObj) {
    let pc = new RTCPeerConnection(servers);
    let localStreamObj;
    let remoteStreamObj;
    peerConnectionsObj[i].pc = pc;
    peerConnectionsObj[i].localStreamObj = localStreamObj;
    peerConnectionsObj[i].remoteStreamObj = remoteStreamObj;

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
      let myscreen2video = document.getElementById("remotescreenvideo"+sessionStorage.getItem("localremotepersonname"));
      myscreen2video.srcObject = remoteStreamObj;
      myscreen2video.muted = true;
      myscreen2video.play();
    } catch (err) {
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

  for (let i in peerConnectionsObj) {
    peerConnectionsObj[i].pc.onicecandidate = async (event) => {
      //Event that fires off when a new answer ICE candidate is created
      if (event.candidate) {
        console.log("Adding answer candidate...:", event.candidate);
        
        sessionStorage.setItem(
          "createanswerresult",
          JSON.stringify(peerConnectionsObj[i].pc.localDescription)
        );
      }
    };

    await peerConnectionsObj[i].pc.setRemoteDescription(offer3);

    let answer3 = await peerConnectionsObj[i].pc.createAnswer();
    try {
      await peerConnectionsObj[i].pc.setLocalDescription(answer3);
    } catch (err) {
      console.log(err);
    }
  }

  setTimeout(() => {
    socketsend({
      type: "createanswerresult",
      data: {
        meetingname: localmeetingname,
        personname: localpersonname,
        createanswerresult: JSON.parse(
          sessionStorage.getItem("createanswerresult")
        ),
      },
    });
  }, 3000);
};

let addAnswerHandler = async (createanswerresult) => {
  console.log("Add answer triggerd");
  let answer3 = {};

  if (createanswerresult) {
    answer3 = createanswerresult;
  }

  console.log("answer:", answer3);
  for (let i in peerConnectionsObj) {
    // (!peerConnectionsObj[i].pc.currentRemoteDescription){
    setTimeout(() => {
      try {
        peerConnectionsObj[i].pc.setRemoteDescription(answer3);
      } catch (err) {
        console.log(err);
      }
    }, 1000);

    
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
      sessionStorage.setItem("localremotepersonname", value);
    }
    
  };

  let handleClick = async (methodprops) => {
    let { type } = methodprops;
  let {calltopersonnames} = compstate;
    consolelog("handleClick", methodprops);
   
    
    if (type === "addtocalltopersonnames") {
      calltopersonnames.push(sessionStorage.getItem("localremotepersonname"));
      await hideui({});
      await showui({ calltopersonnames: calltopersonnames });
    }
    if (type === "removefromcalltopersonnames") {
      let calltopersonnamesU = [];
      for(let i=0; i<calltopersonnames.length; i++){
        if(calltopersonnames[i] != sessionStorage.getItem("localremotepersonname")){
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

  let {calltopersonnames} = compstate;
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
            onClick={() => makecall({ type: "createAnswer" })}
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
