import axios from "axios";

export const GET_ALL_PLAYERS = "GET_ALL_PLAYERS";

export const getAllPlayersApi = async (params = '') => {
    try {
        const response = await axios.get(`http://localhost:5000/api/player/${params}`);
        return response.data;
    } catch (err) {
        return err
    }
}

export const getPlayerApi = async (id) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/player/${id}`);
        return response.data;
    } catch (err) {
        return err
    }
}

export const updatePlayerApi = async (data) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/player/${data._id}`, data);
        return response.data;
    } catch (err) {
        return err
    }
}

export const deletePlayerApi = async (id) => {
    try {
        const response = await axios.delete(`http://localhost:5000/api/player/${id}`);
        return response.data;
    } catch (err) {
        return err
    }
}

export const createPlayerApi = async (data) => {
    try {
        const response = await axios.post(`http://localhost:5000/api/player/`, data);
        return response.data;
    } catch (err) {
        return err
    }
}