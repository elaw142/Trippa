// const baseUrl = "http://localhost:5107/api/"
const baseUrl = "https://datadons.azurewebsites.net/api/"


function getJson(path) {
    return fetch(baseUrl + path)
      .then(async (res) => {
        if (!res.ok) {
          const responseText = await res.text();
          throw new Error(`HTTP error! Status: ${res.status}. Response: ${responseText}`);
        }
        try {
          return res.json();
        } catch (error) {
          throw new Error(`JSON parsing error: ${error.message}`);
        }
      })
      .catch((error) => {
        throw new Error(`Network error: ${error.message}`);
      });
  }
  

function post(path, data) {
    return fetch(baseUrl + path, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(async (res) => {
        if (!res.ok) {
            const responseText = await res.text();
            throw new Error(`HTTP error! Status: ${res.status}. Response: ${responseText}`);
        }
        try {
            return res.json();
        }  catch {
            return res;
        } finally {
            console.log("returned data");
        }
      })
    .catch((error) => {
        throw new Error(`Network error: ${error.message}`);
    });
}
  

function getVersion() {
    return fetch(baseUrl + "GetVersion")
        .then(res => res.text())
}

function getUserName(userName) {
    return fetch(baseUrl + "GetUserByUsername/" + userName)
        .then((res) => {
            if (res.status === 404) {
                return `User with username ${userName} does not exist.`;
            }
            return res.json();
        })
        .catch((error) => {
            console.error('Error fetching user:', error);
            throw error; // Rethrow the error to be handled by the caller
        });
}

function getUserId(userName) {
    return fetch(baseUrl + "GetIdByUsername/" + userName)
        .then((res) => {
            if (res.status === 404) {
                return `User with username ${userName} does not exist.`;
            }
            return res.text();
        })
        
        .catch((error) => {
            console.error('Error fetching user:', error);
            throw error; // Rethrow the error to be handled by the caller
        });
}

function AddUser(user) {
    return post("AddUser", user);
}

function getAllTrips() {
    return getJson("GetAllTripsOut")
}
function AddDriver(userId, driver) {
    return post("users/AddDriver/"+userId, driver);
}



export {
    getJson, 
    post,
    getVersion,
    getUserName,
    getUserId,
    AddUser,
    getAllTrips,
    AddDriver,
}