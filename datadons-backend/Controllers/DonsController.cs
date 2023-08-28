using Microsoft.AspNetCore.Mvc;
using Data;
using Models;
using Dtos;


namespace Controllers
{
    // TODO: beautify endpoints, eg error handling, better return values
    // localHost:8080/api
    [Route("api")]
    [ApiController]
    public class DonsController : Controller
    {
        private readonly IRepo _repo;
        public DonsController(IRepo repo)
        {
            _repo = repo;
        }

        //* General Endpoints

        // GET api/GetVersion
        [HttpGet("GetVersion")]
        public ActionResult<string> GetVersion()
        {
            return Ok("0.0.2 (TESTING PHASE)");
        }



        //* User Endpoints

        // POST api/AddUser
        [HttpPost("AddUser")]
        public IActionResult AddUser(User user)
        {
            string username = _repo.AddUser(user);
            return new CreatedResult($"/api/GetUser/{username}", user);
        }

        // GET api/GetUser
        [HttpGet("GetUser/{id}")]
        public ActionResult<User> GetUser(long id)
        {
            return Ok(_repo.GetUser(id));
        }

        // GET api/GetAllUsers
        [HttpGet("GetAllUsers")]
        public ActionResult<User[]> GetAllUsers()
        {
            return Ok(_repo.GetAllUsers());
        }

        // POST api/users/AddDriver/{id}
        [HttpPost("users/AddDriver/{userId}")]
        public IActionResult AddDriverToUser(int userId,  DriverDto driverDto)
        {
            User u = _repo.GetUser(userId);
            if(u==null){
                return BadRequest("UserId does not exist");
            }

            Driver d = new Driver{
                UserId = userId,
                User = u,
                LicenseNumber = driverDto.LicenseNumber,
                Car = new Car{
                    Make = driverDto.CarMake,
                    Type = driverDto.CarType,
                    Model = driverDto.CarModel,
                    Color = driverDto.CarColor,
                    LicensePlate = driverDto.PlateNumber
                }
            };

            if (driverDto == null)
            {
                return BadRequest("Driver object is null");
            }

            try
            {
                _repo.AddDriverToUser(userId, d);
                return Ok($"Driver added to user {u.Username}");
            }
            catch (Exception ex)
            {
                // Handle exception and return an error response
                return BadRequest(ex.Message);            
            }
        }

        // DELETE api/users/driver/{userId}
        [HttpDelete("users/driver/{userId}")]
        public IActionResult RemoveDriverFromUser(int userId)
        {
            User u = _repo.GetUser(userId);
            if(u==null){
                return BadRequest("UserId does not exist");
            }
            try
            {
                _repo.RemoveDriverFromUser(userId);
                return Ok($"Driver removed from user {u.Username}");
            }
            catch (Exception ex)
            {
                // Handle exception and return an error response
                return BadRequest(ex.Message);            
            }
        }


 

        //* Trip Endpoints
        
        

        // GET api/GetTrip - get trip by id
        [HttpGet("GetTrip/{id}")]
        public Trip GetTrip(long id)
        {
            return _repo.GetTrip(id);
        }

        // GET api/GetAllTrips - get all trips
        [HttpGet("GetAllTrips")]
        public Trip[] GetAllTrips()
        {
            return _repo.GetAllTrips();
        }

        // POST api/AddTrip - create a new trip
        [HttpPost("AddTrip")]
        public IActionResult AddTrip(Trip trip)
        {
            long id = _repo.AddTrip(trip);
            return new CreatedResult($"/api/GetTrip/{id}", trip);
        }

        // PUT api/UpdateTrip - update a trip
        [HttpPut("UpdateTrip")]
        public IActionResult UpdateTrip(Trip trip)
        {
            _repo.UpdateTrip(trip);
            return new OkResult();
        }

        // DELETE api/DeleteTrip - delete a trip
        [HttpDelete("DeleteTrip/{id}")]
        public IActionResult DeleteTrip(long id)
        {
            _repo.DeleteTrip(id);
            return new OkResult();
        }

        // GET api/GetAllTripsBy/{driverID} - get all trips by user
        [HttpGet("GetAllTripsBy/{driverID}")]
        public Trip[] GetAllTripsBy(long driverID)
        {
            return _repo.GetAllTripsBy(driverID);
        }

        // GET api/Trips/search - Retrieve trips based on certain criterias like start and end GPS locations, whether the trip is full, date and time range, etc.
        [HttpGet("Trips/search")]
        public Trip[] SearchTrips([FromQuery] double? startLatitude, [FromQuery] double? startLongitude, [FromQuery] double? endLatitude, [FromQuery] double? endLongitude, [FromQuery] string date, [FromQuery] string time, [FromQuery] int seats)
        {
            return _repo.SearchTrips(startLatitude, startLongitude, endLatitude, endLongitude, date, time, seats);
        }

    }
}