import axios from "axios";

const API = "http://localhost:5000/api/recruitment";

export const getRecruitments = () => axios.get(API);

export const createRecruitment = (data) => axios.post(API, data);

export const updateRecruitment = (id, data) =>
    axios.put(`${API}/${id}`, data);

export const deleteRecruitment = (id) =>
    axios.delete(`${API}/${id}`);