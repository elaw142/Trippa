const baseUrl = "http://localhost:5107/api/"


function getJson(path) {
    return fetch(baseUrl + path)
        .then(res => res.json())
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
        return res.json();
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

function AddUser(user) {
    return post("AddUser", user);
}

function AddDriver(userId, driver) {
    return post("AddDriver/"+userId, driver);
}

// const test = {
//     LicenceNumber: "123456",
//     CarModel: "test",
//     CarColor: "test",
//     CarMake: "test", 
//     CarType: "test",
//     PlateNumber: "test",
// }

// AddDriver(1, test).then((res) => {console.error.og(res)})

export {
    getJson, 
    post,
    getVersion,
    getUserName,
    AddUser,
    AddDriver,
}