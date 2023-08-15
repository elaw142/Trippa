using Microsoft.AspNetCore.Mvc;
using Data;
using Models;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Controllers{
    // TODO: beautify endpoints, eg error handling, better return values
    // localHost:8080/api
    [Route("api")]
    [ApiController]
    public class DonsController{
        private readonly IRepo _repo;
        public DonsController(IRepo repo){
            _repo = repo;
        }

        // GET api/GetVersion
        [HttpGet("GetVersion")]
        public string GetVersion(){
            return "0.0.2 (TESTING PHASE)";
        }

        // POST api/AddUser
        [HttpPost("AddUser")]
        public IActionResult AddUser(User user){
            string username = _repo.AddUser(user);
            return new CreatedResult($"/api/GetUser/{username}", user);
        }

        // GET api/GetUser
        [HttpGet("GetUser/{id}")]
        public User GetUser(long id){
            return _repo.GetUser(id);
        }

        // GET api/GetAllUsers
        [HttpGet("GetAllUsers")]
        public User[] GetAllUsers(){
            return _repo.GetAllUsers();
        }
           
        // GET api/GetTrip
        [HttpGet("GetTrip/{id}")]
        public Trip GetTrip(long id){
            return _repo.GetTrip(id);
        }

        // GET api/GetAllTrips
        [HttpGet("GetAllTrips")]
        public Trip[] GetAllTrips(){
            return _repo.GetAllTrips();
        }

        // POST api/AddTrip
    }
}