import React, {useEffect, useState} from 'react'

import axios from 'axios';

const Home =()=>{

    const [data, setData] = useState({})

    useEffect(()=>{
        const getData = async () => {
            const config = {
                headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json",
                },
              };
            try{
            const res = await axios.get(`${process.env.REACT_APP_API_URL}`, config)
            if (res.data){
                setData(res.data);
                console.log(res.data);
            } else {
                console.log('500 internal server error!');
            }} catch (err){
                console.log(err);
            }
        }
        getData();
    }, [])

    return(
        <>
            <div>{data.message}</div>
        </>
    )
};

export default Home;