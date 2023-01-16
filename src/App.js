import logo from './logo.svg';
import './App.css';
import React, { useState,useEffect, createRef } from 'react';

function App() {

  const [compstate, setCompstate] = useState({
    showui: true,
  });

  useEffect(() => {
    getData();

  }, []);

  let getData = async (methodprops) => {
    let totaldata = await localStorage.getItem("totaljson");
    if(totaldata){
    let totaldataJson = JSON.parse(totaldata);
    let meetingname = totaldataJson["meetingname"];
    let personname = totaldataJson["personname"];
    showui({meetingname:meetingname,personname:personname });
    }
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

    if(type == "meetingname" || type == "personname"){
      await showui({type:value});
    }
  }

  let handleClick = async (methodprops) => {
    let { type, order } = methodprops;
    console.log(methodprops);
    let totaldata = await localStorage.getItem("totaljson");
    let totaldataJson = {};
    if(totaldata){
      totaldataJson = JSON.parse(totaldata);
    }

   if(type == "createmeeting"){
    if(totaldataJson && totaldataJson.meetings){
      totaldataJson.meetings[compstate.meetingname] = {}

    }
    else{
      totaldataJson.meetings = {};
      totaldataJson.meetings[compstate.meetingname] = {}
    }


    await localStorage.setItem(
      "totaljson",
      JSON.stringify(totaldataJson)
    );
  }
  if(type == "joinmeeting"){
    if(totaldataJson && totaldataJson.meetings && totaldataJson.meetings[compstate.meetingname]){
    }
    else{
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
    <input   onChange={(e) =>
            handleChange({
              type: "meetingname",
              value: e.target.value,
            })
          }
           defaultValue={compstate.meetingname}
            />
    personname
    <input   onChange={(e) =>
            handleChange({
              type: "personname",
              value: e.target.value,
            })
          }
          defaultValue={compstate.personname}
          />
    <div onClick={() => handleClick({type:"createmeeting"})} >create</div>
    <div  onClick={() => handleClick({type:"joinmeeting"})} >Join</div>
   </div>
  
  );
  }
}

export default App;