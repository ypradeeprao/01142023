import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, createRef } from 'react';
let socket = new WebSocket("wss://s8239.nyc1.piesocket.com/v3/1?api_key=eWE09fv3RllnW6tVNzfP85M4rCn6ckxRQfHLP4aX&notify_self=1");



socket.onopen = function (e) {
  console.log("[open] Connection established");
  console.log("Sending to server");
  //socket.send("My name is John");
};

socket.onmessage = function (event) {
  let datafromserver = JSON.parse(event.data);
  console.log(datafromserver.type);
  console.log(datafromserver.totaldata);
  if (datafromserver &&
    (datafromserver.type == "createmeeting" || datafromserver.type == "joinmeeting"
      || datafromserver.type == "quitmeeting")
  ) {
    // localStorage.setItem(
    //   "totaljson",
    //   datafromserver.totaldata
    // );
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


function App() {

  const [compstate, setCompstate] = useState({
    showui: true,
    mainpeerconnecionObjArray: []
  });

  useEffect(() => {
    // getData();

  }, []);




  let getData = async (methodprops) => {

  }

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
    let { type, order, value } = methodprops;
    console.log(methodprops);

    if (type == "meetingname") {
      await showui({ "meetingname": value });
    }
    if (type == "personname") {
      await showui({ "personname": value });
    }
  }

  let handleClick = async (methodprops) => {
    let { type, order } = methodprops;
    console.log(methodprops);
    if (type == "createmeeting") {
      socket.send(JSON.stringify({ type: "createmeeting", data: { meetingname: compstate.meetingname, personame: compstate.personame } }));
    }
    if (type == "joinmeeting") {
      socket.send(JSON.stringify({ type: "joinmeeting", data: { meetingname: compstate.meetingname, personame: compstate.personame } }));
    }
    if (type == "quitmeeting") {
      socket.send(JSON.stringify({ type: "quitmeeting", data: { meetingname: compstate.meetingname, personame: compstate.personame } }));
    }
    else {
      alert("no meeting exists");
    }
  }
}

console.log(compstate);
if (compstate.showui != true) {
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