import axios from "axios";

export default axios.create({
  baseURL: " https://chatting-c70f7ffdf44c.herokuapp.com", // Explicitly set backend URL
});
