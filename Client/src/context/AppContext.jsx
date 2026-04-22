import axios from "axios";

import { createContext, useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useUser,useAuth } from "@clerk/react";

import { toast } from "react-hot-toast";



const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;



export const api = axios.create({

    baseURL: API_BASE_URL,      

    withCredentials: true,

});



const AppContext = createContext();



export const AppProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY || "$";

    const navigate = useNavigate();

    const {user} = useUser();

    const {getToken} = useAuth();

    const [isOwner,setIsOwner] = useState(false);

    const [showHotelReg,setShowHotelReg] = useState(false);

    const [searchedCities,setSearchedCities] = useState([]);

    const [rooms, setRooms] = useState([]);

    const fetchRooms = async() => {

        try {

            console.log('Fetching rooms from /api/rooms...');

            const { data} = await api.get("/api/rooms");

            console.log('Rooms response:', data);

            if(data.success) {

                setRooms(data.rooms)

                console.log('Rooms set:', data.rooms);

            }

            else toast.error(data.message)

        } catch (error) {

            console.error('Error fetching rooms:', error);

            toast.error(error.message)

        }

    }

    const fetchUser = async () => {
        try {
            console.log('Fetching user data...')
            const {data} = await axios.get(`${API_BASE_URL}/api/user`,{headers:{"Authorization":`Bearer ${await getToken()}`}});
            console.log('User data response:', data)
            if(data.success){
                setIsOwner(data.role === "hotelOwner");
                console.log('Setting isOwner to:', data.role === "hotelOwner")
                setSearchedCities(data.recentSearchedCities);
            } else {
                console.log('User data fetch failed, retrying...')
                setTimeout(() => {
                    fetchUser();
                }, 5000);
            }
        } catch (error) {
            console.error('Error fetching user:', error)
           toast.error(error.message);
        }
    };



    useEffect(()=>{
       if(user) {

        fetchUser();

       }

    },[user]);

    useEffect(()=>{

        fetchRooms();

    },[])

    const value ={

        currency,

        navigate,

        user,

        getToken,

        isOwner,

        setIsOwner,

        showHotelReg,

        setShowHotelReg,

        searchedCities,

        setSearchedCities,

        axios,

        rooms,

        setRooms,

    }

    return (

        <AppContext.Provider value={value}>

            {children}

        </AppContext.Provider>

    );

};



export const useAppContext = () => {

    return useContext(AppContext);

};

