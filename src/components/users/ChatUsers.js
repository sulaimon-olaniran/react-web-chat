import React, { useContext, useState } from 'react'
import { FetchDataContext } from '../../context/FetchDataContext'
import EachUser from './eachuser/EachUser'
import TextField from '@material-ui/core/TextField'

const ChatUsers = () =>{
    const { appUsers } = useContext(FetchDataContext)
    const [searchField, setSearchField] = useState("")
    //console.log(appUsers)

    const sortFunction = (a, b) =>{
        const comparisonA = a.userName
        const comparisonB = b.userName
        let comparisonStatus = 0

        if(comparisonA < comparisonB){
            comparisonStatus = -1
        }
        else 
        if( comparisonA > comparisonB){
            comparisonStatus = 1
        }
        return comparisonStatus;
    }

    const handleSearchInput = (e) => {
        setSearchField(e.target.value)
    }

    const filterSearchFunction = (data) =>{
        return(
             data.userName.toLowerCase().includes(searchField.toLowerCase()) ||
             data.firstName.toLowerCase().includes(searchField.toLowerCase()) ||
             data.lastName.toLowerCase().includes(searchField.toLowerCase())
        ) 
    }

    const searchResults = appUsers && appUsers.filter(filterSearchFunction)

    const listToDisplay = searchField === "" ? appUsers : searchResults


    return(
        <div className="chat-users-container">
            <div className="search-container" >
                    <TextField id="standard-basic" label="Search" onChange={handleSearchInput} color="secondary" />
            </div>

            <div className="users-listing-container">
            {
                appUsers && listToDisplay.sort(sortFunction).map((user) =>{
                    return(
                        <React.Fragment key={user.id}>
                           <EachUser user={user} />
                        </React.Fragment>
                    )
                })
            }
            </div>
        </div>
    )
}

export default ChatUsers