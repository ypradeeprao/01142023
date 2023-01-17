
import './App.css';
import React, { useState, useEffect } from 'react';
let socket = new WebSocket("wss://s8239.nyc1.piesocket.com/v3/1?api_key=eWE09fv3RllnW6tVNzfP85M4rCn6ckxRQfHLP4aX&notify_self=1");



socket.onopen = function (e) {
  consolelog("[open] Connection established");
  consolelog("Sending to server");
  //socket.send("My name is John");
};



socket.onmessage = function (event) {
  consolelog("onmessageevent",event);
  let datafromserver = JSON.parse(event.data);



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




function App() {

  const [compstate, setCompstate] = useState({
    showui: true,

  });

  useEffect(() => {
    getData();

  }, []);




  let getData = async (methodprops) => {

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
       
      </div>

    );
  }
}

export default App;