import axios from "axios";

export const GET_ALL_PLAYERS = "GET_ALL_PLAYERS";

export const getAllPlayersApi = async (params = '') => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/player/${params}`);
        return response.data;
    } catch (err) {
        return err
    }
}

export const getPlayerApi = async (id) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/player/${id}`);
        return response.data;
    } catch (err) {
        return err
    }
}

export const updatePlayerApi = async (data) => {
    try {
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/player/${data._id}`, data);
        return response.data;
    } catch (err) {
        return err
    }
}

export const deletePlayerApi = async (id) => {
    try {
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/player/${id}`);
        return response.data;
    } catch (err) {
        return err
    }
}

export const createPlayerApi = async (data) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/player/`, data);
        return response.data;
    } catch (err) {
        return err
    }
}