using Models;
using Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;

namespace Data
{
    public class Repo : IRepo
    {
        private readonly DonsDbContext _repo;
        public Repo(DonsDbContext repo)
        {
            _repo = repo;
        }

        public string AddUser(User user)
        {
            _repo.Users.Add(user);
            _repo.SaveChanges();
            return user.Username;
        }

        public User GetUser(long id)
        {
            return _repo.Users.FirstOrDefault(u => u.Id == id);
        }

        public User[] GetAllUsers()
        {
            User[] c = _repo.Users.ToArray();
            return c;
        }
        public Trip GetTrip(long id)
        {
            return _repo.Trips.FirstOrDefault(t => t.TripID == id);
        }
        public Trip[] GetAllTrips()
        {
            return _repo.Trips.ToArray();
        }
        //TODO
        public Trip[] SearchTrips(string startLocation, string endLocation, string startDate, string endDate, int maxRiders)
        {
            var query = _repo.Trips.AsQueryable(); // AsQueryable does not hit the database but allows us to build a query so that we can add to it

            // TODO - This method over here is a bit of a mess. It's only getting the exact location but what we want to achieve is a radius not pin point location 
            // I looked in this and we need to looked into something called Havensine formula. 
            if (!string.IsNullOrEmpty(startLocation))
            {
                var startParts = startLocation.Split(',');
                if (startParts.Length == 2)
                {
                    double startLat, startLon;
                    if (double.TryParse(startParts[0], out startLat) && double.TryParse(startParts[1], out startLon))
                    {
                        query = query.Where(t => t.StartPoint.Latitude == startLat && t.StartPoint.Longitude == startLon);
                    }
                }
            }
            return null;
        }
        public Trip[] GetAllTripsBy(long driverId)
        {
            return _repo.Trips.Where(t => t.DriverID == driverId).ToArray();
        }
        public void DeleteTrip(long id)
        {
            var tripToDelete = _repo.Trips.FirstOrDefault(t => t.TripID == id);
            if (tripToDelete != null)
            {
                _repo.Trips.Remove(tripToDelete);
                _repo.SaveChanges();
            }
        }
        public void UpdateTrip(Trip trip)
        {
            _repo.Trips.Update(trip);
            _repo.SaveChanges();
        }
        public long AddTrip(Trip trip)
        {
            _repo.Trips.Add(trip);
            _repo.SaveChanges();
            return trip.TripID;
        }
    }
}