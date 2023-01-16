import logo from './logo.svg';
import './App.css';
import React, { useState,useEffect, createRef } from 'react';
import { createChannel, createClient, RtmMessage } from 'agora-rtm-react';
const useClient = createClient('58389bfcba704a8aa0f964e67a4ca6be');
const useChannel = createChannel('channelName');

function App() {
  const client = useClient();
  const testChannel = useChannel(client);

  const [compstate, setCompstate] = useState({
    showui: true,
    mainpeerconnecionObjArray:[]
  });

  useEffect(() => {
   // getData();

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

    if(type == "meetingname" ){
      await showui({"meetingname":value});
    }
    if(type == "personname"){
      await showui({"personname":value});
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

    await client.login({ uid: 'userId' });
    await testChannel.join();
   // const message = client.createMessage({ "text", messageType: 'TEXT' });
   // await testChannel.sendMessage(message);

    if(totaldataJson && totaldataJson.meetings 
      && totaldataJson.meetings[compstate.meetingname]){
    
   let joinednames = [];
   if(totaldataJson.meetings[compstate.meetingname].joinednames){
    joinednames = totaldataJson.meetings[compstate.meetingname].joinednames;
  }

  let joinedname ={
    name:compstate.personname,
    mainpeerconnections:[]
    };
   
    joinednames.push(joinedname);
     totaldataJson.meetings[compstate.meetingname].joinednames = joinednames;


     if(totaldataJson.meetings[compstate.meetingname].joinednames){
      joinednames = totaldataJson.meetings[compstate.meetingname].joinednames;
  
      let mainpeerconnections = [];
    
      for(let i=0; i< joinednames.length; i++){
        if(compstate.personname == joinednames[i].name && joinednames[i].mainpeerconnections){
          mainpeerconnections = joinednames[i].mainpeerconnections;
        }
      }
     
      for(let i=0; i< joinednames.length; i++){
        if(compstate.personname != joinednames[i].name){
  
          let mainpeerconnecionobj ={
            meetingname:compstate.meetingname,
            fromname:compstate.personname,
             toname:joinednames[i].name, 
             peerconnecionobject:{}
            };
  
  
        mainpeerconnections.push(mainpeerconnecionobj);
        }
        joinednames[i].mainpeerconnections = mainpeerconnections;
        }
        
  
     
      
  
  
    }



      
      
        await localStorage.setItem(
          "totaljson",
          JSON.stringify(totaldataJson)
        );
        
    }
    else{
      alert("no meeting exists");
    }



  }
  if(type == "quitmeeting"){
    if(totaldataJson && totaldataJson.meetings 
      && totaldataJson.meetings[compstate.meetingname]){
    
   let joinednames = [];
   if(totaldataJson.meetings[compstate.meetingname].joinednames){
    joinednames = totaldataJson.meetings[compstate.meetingname].joinednames;
  }

    let joinednamesU = [];
   for(let i=0; i< joinednames.length; i++){
   if(compstate.personname != joinednames[i].name){
    joinednamesU.push(joinednames[i]);
   }
   }
   
     totaldataJson.meetings[compstate.meetingname].joinednames = joinednamesU;



      
        await localStorage.setItem(
          "totaljson",
          JSON.stringify(totaldataJson)
        );
        
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
    <div  onClick={() => handleClick({type:"quitmeeting"})} >quit</div>
    <div  onClick={() => handleClick({type:"deletemeeting"})} >delete</div>
   </div>
  
  );
  }
}

export default App;