import { useEffect, useState } from "react"

export default function Todo(){
    const [title,setTitle]=useState("");
    const [description,setDescription]=useState("");
    const [todos,setTodos]=useState([])
    const [error,setError]=useState('')
    const [message,setMessage]=useState('')
    //Edit
    const [editId,setEditId]=useState(-1)
    const [editTitle,setEditTitle]=useState('')
    const [editDescription,setEditDescription]=useState('')


    const apiUrl="http://localhost:8000"

    const handleSubmit=()=>{
        setError('')
        setTitle('')
        setDescription('')
        //check inputs 
        if (title.trim()!==''&& description.trim()!=='') {
            fetch(apiUrl+"/todos",{
                method:"POST",
                headers:{
                    'Content-type':'application/json'
                },
                body:JSON.stringify({title,description})
            })
                .then((res)=>{
                if (res.ok) {
                    //add item to list
                setTodos([...todos,{title,description}])
                setMessage("Item added successfully")
                setTimeout(() => {
                    setMessage("")
                }, 3000);
                }else{
                    //set error
                    setError('Unable to create Todo Item')
                }
            }).catch(()=>{
                setError('Unable to create Todo Item')
            })
        }
    }
    useEffect(()=>{
        getItems()},[])
    const getItems=()=>{
        fetch(apiUrl+"/todos")
        .then((res)=>res.json())
        .then((res)=> setTodos(res))
    }
    const handleEdit=(item)=>{
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description)
    }
    const handleUpdate=()=>{
        setError('')
        setEditTitle('')
        setEditDescription('')
        //check inputs 
        if (editTitle.trim()!==''&& editDescription.trim()!=='') {
            fetch(apiUrl+"/todos"+editId,{
                method:"PUT",
                headers:{
                    'Content-type':'application/json'
                },
                body:JSON.stringify({title:editTitle,description:editDescription})
            })
                .then((res)=>{
                if (res.ok) {
                    //Update item to list
                    const updatedTodos=todos.map((item)=>{
                        if (item._id==editId) {
                            item.title=editTitle
                            item.description=editDescription
                        }
                        return item
                    })
                setTodos(updatedTodos)
                setMessage("Item Updated successfully")
                setTimeout(() => {
                    setMessage("")
                }, 3000)
                setEditId(-1)
                }else{
                    //set error
                    setError('Unable to create Todo Item')
                }
            }).catch(()=>{
                setError('Unable to create Todo Item')
            })
        }

    }
    const handleEditCancel=()=>{
        setEditId(-1)
    }
    const handleDelete=(id)=>{
        if (window.confirm('Are you sure want to delete??')) {
            fetch(apiUrl+'/todos'+id,{
                method:"DELETE"
            }).then(()=>{
                const updatedTodos=todos.filter((item)=>item._id !==id)
                setTodos(updatedTodos)
            })
        }
    }

    return <>
    <div className="row p-3 bg-success text-light">
        <h1>Todo Project with Mern Stack</h1>
    </div>
    <div className="row">
        <h3>ADD ITEM</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-2">
            <input placeholder="Title"onChange={(e)=>setTitle(e.target.value)} className="form-control"value={title} type="text"/>
            <input placeholder="Description" onChange={(e)=>setDescription(e.target.value)} className="form-control"value={description} type="text"/>
            <button className="btn btn-dark " onClick={handleSubmit}>Submit</button>
        </div>
        {error && <p className="text-danger">{error}</p>}
    </div>
    <div className="row mt-3">
        <h3>Tasks</h3>
        <div className="col-md-6">  
            <ul className="list-group-items">
            {
            todos.map((item)=>
                <li className="list-group-items bg-info d-flex align-items-center justify-content-between my-2">
                <div className="d-flex flex-column">
                    {
                    editId ==-1  || editId!==item._id?<>
                        <span className="fw-bold">{item.title}</span>
                        <span className="fw-bold">{item.description}</span>
                        </>:<>
                        <div className="form-group d-flex gap-2">
                            <input placeholder="Title"onChange={(e)=>setEditTitle(e.target.value)} className="form-control "value={editTitle} type="text"/>
                            <input placeholder="Description" onChange={(e)=>setEditDescription(e.target.value)} className="form-control"value={editDescription} type="text"/>
                        </div>
                        </>
                        
                    
                     }
                </div>
                
                <div className="d-flex gap-2">
                {editId ==-1 || editId!==item._id ?<button className="btn btn-warning" onClick={()=>handleEdit(item)}>Edit</button>:<button className="btn btn-warning" onClick={handleUpdate}>Update</button>}
                {editId ==-1 || editId!==item._id ?<button className="btn btn-danger" onClick={()=>handleDelete(item._id)}>Delete</button>:
                <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>}

                </div>
               
            </li>
            )}
            
        </ul></div>
        
    </div>
</>

}