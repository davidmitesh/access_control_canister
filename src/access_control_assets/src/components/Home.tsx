import * as React from "react";
import { Button, Text ,StatusLight,ListBox, Item, Section,TextField} from "@adobe/react-spectrum";
import {Cell, Column, Row, TableView, TableBody, TableHeader} from '@react-spectrum/table'

import ImageProfile from "@spectrum-icons/workflow/ImageProfile";
import { useHistory ,} from "react-router-dom";
import { AppContext } from "../App";
import  { Principal } from '@dfinity/principal';
import { Result_1, Role, RoleFormatted, rolesMap } from "../../../declarations/access_control/access_control.did";
import toast, { Toaster } from 'react-hot-toast';
// import Loader from './components/Loader';

interface roleRequests {
    principal?: string;
    role?:Role
  }
function Home() {
  const history = useHistory();
  const {actor,authClient} = React.useContext(AppContext)
  const [role,setRole] = React.useState("")
  const [myRoleRequest,setMyRoleRequest]=React.useState<RoleFormatted>()
  let [animalId, setAnimalId] = React.useState();
  const [roleRequests,setRoleRequests] =React.useState<rolesMap[]>()
  let [name, setName] = React.useState('');
  let [requestsSelected, setRequestsSelected] = React.useState<any[]>()
  let [principalId,setPrincipalId] = React.useState<Principal>()
  let columns = [
    {name: 'Name', uid: 'name'},
    {name: 'Principal', uid: 'type'},
    {name: 'Decision', uid: 'level'}
  ];
  
    React.useEffect(()=>{
        let myIdentity = authClient?.getIdentity().getPrincipal()
        if (myIdentity){
            setPrincipalId(myIdentity)
            actor?.my_role(myIdentity).then((result)=>{
                // console.log('from result',result)
                if ('ok' in result){
                    if ('admin' in result['ok']){
                        setRole('admin')
                    }else if ('owner' in result['ok']){
                        setRole('owner')
                    } else if ('authorized' in result['ok']){
                        setRole('user')
                    } else {
                        setRole('unauthorized')
                    }
                }
                console.log('role is',role)
                
                
            }
            
            )
           
             // console.log('I am called')
             actor?.my_role_request().then((result)=>{
                if ('ok' in result){
                    if (result['ok'].length != 0){
                        setMyRoleRequest(result['ok'][0])
                    }
                }else {
                    console.log('error occured while fetching role request.')
                    console.log('error is ', result['err'])
                }
            }) 
            
        }

        

    },[authClient])

    React.useEffect(()=>{
        if (role === 'admin'){
            actor?.get_role_requests().then((result)=>{
                console.log(result)
                if ('ok' in result){
                    setRoleRequests(result['ok'])

                    console.log("from role requests",roleRequests)
                }
                
            })
        }
    },[role])

    const approveRequestsSubmit = async()=>{
        return new Promise((resolve,reject)=>{
            
            if (requestsSelected){
                let obj = requestsSelected.map((item)=>{
                    return JSON.parse(item)
                })
                // let objects = JSON.parse(requestsSelected)
                obj.forEach((item)=>{
                    let principalFinal:Principal = Principal.fromText(item.principal)
                    actor?.assign_role(Principal.fromText(item.principal),{'authorized':null},item.name).then((result)=>{
                        console.log(`Added ${item.name} to authorized personnels`)
                    }).catch((err)=>{
                        console.log(`some error occured while authorizing access ${err}`)
                    })
                })
                resolve(true)
                
            }
        })
        
    }
  return (
    <>
         <section>
        {console.log("hey inside component",roleRequests)}
      <h2>Welcome to BigIdea Films Access control canister</h2>
      <h3>Your internet identity : {authClient?.getIdentity().getPrincipal().toString()}</h3>
      <p>
        This is an open-source, instructional application, built on the Internet
        Computer. This is a kind of play store for the application canisters that BigIdea films will
        create and all access control mechanism will be taken care through this site.
      </p>
      <h3>Your role is: {role}</h3>
      
        {myRoleRequest ? (
            <>
            <h3>Your request status</h3>
            <StatusLight variant="notice">waiting for admin to confirm your request</StatusLight>
            </>
        ):(
            <>
        {
            (role == 'admin' || role == 'owner')?(
                <></>
            ):(
                <>
                <TextField label="Name" value={name} onChange={setName}/>
                <Button variant="cta" onPress={async ()=>{
                    if (principalId){
                        actor?.request_role({'authorized':null},name,principalId).then((result)=>{
                            toast('Your request has been submitted to the admin/s.')
                            console.log(result)
                            console.log('successful')
                        })
                    }else{
                        alert("principal id is not set!Try refresh or login!")
                    }
                    }}>
                    Ask Permission to access
                    </Button>
                </>
                
            )
        }
        
            </>
        )}


{/* <TableView
  aria-label="Example table with multiple selection"
  selectionMode="multiple"
  defaultSelectedKeys={['2', '4']}>
  <TableHeader>
    <Column>ID</Column>
    <Column>Type</Column>
    <Column align="end">Level</Column>
  </TableHeader> */}
  {/* <TableBody>  */}
     
    {/* <Row key="1">
      <Cell>Charizard</Cell>
      <Cell>Fire, Flying</Cell>
      <Cell>67</Cell>
    </Row> */}

     {/* <TableBody items={roleRequests}>
    {(item) => <Row>{(columnKey) => <Cell>{item[columnKey]}</Cell>}</Row>}
  </TableBody>     */}
  {/* </TableBody> */}
{/* </TableView> */}
{}
{
    roleRequests ? (
        <>
        <h3>Requests waiting to be approved:</h3>
        <ListBox
        width="size-4000"
        aria-label="Animals"
        items={roleRequests}
        selectionMode="multiple"
        onSelectionChange={(selected) => setRequestsSelected(Array.from(selected))}
        >
        {(item) => {
        
        return(<Item key={JSON.stringify({principal : item.principal.toString(),name : item.name})}>{item.name+"      "+"Id:"+item.principal.toString()}</Item>)}}
      </ListBox>

      
        </>

        
    ) : (
        <></>
    )
}

{
    

    requestsSelected && requestsSelected.length > 0 ? (
        
        <Button variant="cta" onPress={async ()=>{
            await approveRequestsSubmit()
            }}>
                Approve Requests
        </Button>
        
    ):(
        <></>
    )
}


      
    </section>
    
    </>
   
  );
}

export default React.memo(Home);
