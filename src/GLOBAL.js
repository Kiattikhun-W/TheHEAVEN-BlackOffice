const GLOBAL = {

  BASE_SERVER: {
    // URL: 'https://6250-2403-6200-8830-bb02-351e-8078-731a-a663.ngrok.io/',
    // URL: "https://the-heaven-api.ap.ngrok.io/",
    // URL_IMG: "https://the-heaven-api.ap.ngrok.io/",
    // URL: "http://159.223.33.155:3001/",
    // URL_IMG: "http://159.223.33.155:3001/",
    URL: "http://localhost:3001/",
    URL_IMG: "http://localhost:3001/",
    // URL: "https://the-heaven-api.ap.ngrok.io/",
    // URL_IMG: "https://the-heaven-api.ap.ngrok.io/",
    // URL: "http://159.223.33.155:3001/",
    // URL_IMG: "http://159.223.33.155:3001/",
  },

  ACCESS_TOKEN: {
    Authorization: localStorage.getItem("Authorization"),
  },
};

export default GLOBAL;
