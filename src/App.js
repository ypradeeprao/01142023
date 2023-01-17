
import './App.css';
import React, { useState, useEffect } from 'react';
let socket = new WebSocket("wss://s8239.nyc1.piesocket.com/v3/1?api_key=eWE09fv3RllnW6tVNzfP85M4rCn6ckxRQfHLP4aX&notify_self=1");



socket.onopen = function (e) {
  console.log("[open] Connection established");
  console.log("Sending to server");
  //socket.send("My name is John");
};



socket.onmessage = function (event) {
  console.log(event);
  let datafromserver = JSON.parse(event.data);



  if (datafromserver &&
    (datafromserver.type === "createmeeting")
  ) {
    createMeeting(datafromserver);
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
    (datafromserver.type === "deletemeeting")
  ) {
    deleteMeeting(datafromserver);
  }



};

socket.onclose = function (event) {
  if (event.wasClean) {
    console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    console.log('[close] Connection died');
  }
};

socket.onerror = function (error) {
  console.log(`[error]`);
};

let createMeeting = async (methodprops) => {
  console.log(methodprops);
  let { meetingname, personname } = methodprops.data;
  let meetingsdata = localStorage.getItem("meetings");
  let meetingsdatajson = [];
  if (meetingsdata) {
    meetingsdatajson = JSON.parse(meetingsdata);
  }
 
  let localpersonname = localStorage.getItem("localpersonname");
  let ismeetingalreadyexists = false;
  if (meetingsdatajson && meetingsdatajson.length > 0) {
    for (let i = 0; i < meetingsdatajson.length; i++) {
      if (meetingsdatajson[i].name === meetingname) {
        ismeetingalreadyexists = true;
      }
    }

  }

  if (ismeetingalreadyexists === true && localpersonname === personname) {
    alert("meeting already exists");
  }
  else {

    if (meetingsdatajson && meetingsdatajson.length > 0) {
    }
    else {
      meetingsdatajson = [];
    }
    let newmeeting = { name: meetingname };
    meetingsdatajson.push(newmeeting);
    console.log(meetingsdatajson);
    localStorage.setItem("meetings", JSON.stringify(meetingsdatajson));
  }

}
let joinMeeting = async (methodprops) => {
  console.log(methodprops);
  let { meetingname, personname } = methodprops.data;
  let meetingsdata = localStorage.getItem("meetings");
  let meetingjoineesdata = localStorage.getItem("meetingjoinees");
  let localpersonname = localStorage.getItem("localpersonname");
  let ismeetingexists = false;
  let isalreadyinmeeting = false;

  let meetingsdatajson = [];
  if (meetingsdata) {
    meetingsdatajson = JSON.parse(meetingsdata);
  }
 
  let meetingjoineesdatajson = [];
  if (meetingjoineesdata) {
    meetingjoineesdatajson = JSON.parse(meetingjoineesdata);
  }
 
  if (meetingsdatajson && meetingsdatajson.length > 0) {
    for (let i = 0; i < meetingsdatajson.length; i++) {
      if (meetingsdatajson[i].name === meetingname) {
        ismeetingexists = true;
      }
    }

  }

  if (meetingjoineesdatajson && meetingjoineesdatajson.length > 0) {
    for (let i = 0; i < meetingjoineesdatajson.length; i++) {
      if (meetingjoineesdatajson[i].meetingname === meetingname && meetingjoineesdatajson[i].name === personname) {
        isalreadyinmeeting = true;
      }
    }

  }

  if (ismeetingexists === false && localpersonname === personname) {
    alert("meeting not exists");
  }
  else if (isalreadyinmeeting === true && localpersonname === personname) {
    alert("already in meeting");
  }
  else {

    if (meetingjoineesdata && meetingjoineesdata.length > 0) {
    }
    else {
      meetingjoineesdata = [];
    }
    let newmeetingjoinee = { meetingname: meetingname, name:personname };
    meetingjoineesdata.push(newmeetingjoinee);
    console.log(meetingjoineesdata);
    localStorage.setItem("meetingjoinees", JSON.stringify(meetingjoineesdata));
  }

}
let quitMeeting = async (methodprops) => {
}
let deleteMeeting = async (methodprops) => {
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
    console.log(methodprops);

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
    console.log(methodprops);
    let localmeetingname = localStorage.getItem("localmeetingname");
    let localpersonname = localStorage.getItem("localpersonname");
    if (type === "createmeeting") {
      socket.send(JSON.stringify({ type: "createmeeting", data: { meetingname: localmeetingname, personame: localpersonname } }));
    }
    if (type === "joinmeeting") {
      socket.send(JSON.stringify({ type: "joinmeeting", data: { meetingname: localmeetingname, personame: localpersonname } }));
    }
    if (type === "quitmeeting") {
      socket.send(JSON.stringify({ type: "quitmeeting", data: { meetingname: localmeetingname, personame: localpersonname } }));
    }

  }


  console.log(compstate);
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
        <div onClick={() => handleClick({ type: "joinmeeting" })} >Join</div>
        <div onClick={() => handleClick({ type: "quitmeeting" })} >quit</div>
        <div onClick={() => handleClick({ type: "deletemeeting" })} >delete</div>
      </div>

    );
  }
}

export default App;