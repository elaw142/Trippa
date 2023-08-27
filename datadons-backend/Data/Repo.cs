using Models;
using Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore;

namespace Data
{
    public class Repo : IRepo
    {
        private readonly DonsDbContext _repo;

        public Repo(DonsDbContext repo)
        {
            _repo = repo;
        }

        //* Users Methods
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

        public User AddDriverToUser(long userId, Driver driver)
        {
            var user = _repo.Users.Include(u => u.Driver).FirstOrDefault(u => u.Id == userId);
            if (user != null)
            {
                user.Driver = driver;
                _repo.SaveChanges();
            }
            return user;
        }

        public User RemoveDriverFromUser(long userId)
        {
            var user = _repo.Users.Include(u => u.Driver).FirstOrDefault(u => u.Id == userId);
            if (user != null)
            {
                user.Driver = null;
                _repo.SaveChanges();
            }
            return user;
        }






        //* Trips Methods
        public Trip GetTrip(long id)
        {
            return _repo.Trips.FirstOrDefault(t => t.TripID == id);
        }
        public Trip[] GetAllTrips()
        {
            return _repo.Trips.ToArray();
        }

        // public Trip[] SearchTrips(string startLocation, string endLocation, string startDate, string endDate, int maxRiders)
        // {
        //     IQueryable<Trip> query = _repo.Trips.Include(t => t.StartPoint).Include(t => t.EndPoint);

        //     const double START_RADIUS_KM = 1.0; // Filter by start location within 1km
        //     if (!string.IsNullOrEmpty(startLocation))
        //     {
        //         var startParts = startLocation.Split(',');
        //         if (startParts.Length == 2)
        //         {
        //             double lat = double.Parse(startParts[0]);
        //             double lng = double.Parse(startParts[1]);
        //             query = query.Where(t => HaversineDistance(t.StartPoint.Latitude, t.StartPoint.Longitude, lat, lng) <= START_RADIUS_KM);
        //         }
        //     }

        //     const double END_RADIUS_KM = 1.0; // Filter by end location within 1km
        //     if (!string.IsNullOrEmpty(endLocation))
        //     {
        //         var endParts = endLocation.Split(',');
        //         if (endParts.Length == 2)
        //         {
        //             double lat = double.Parse(endParts[0]);
        //             double lng = double.Parse(endParts[1]);
        //             query = query.Where(t => HaversineDistance(t.EndPoint.Latitude, t.EndPoint.Longitude, lat, lng) <= END_RADIUS_KM);
        //         }
        //     }

        //     // Filter for date range
        //     if (DateTime.TryParse(date, out DateTime searchDate))
        //     {
        //         query = query.Where(t => t.DateTime.Date == searchDate.Date);
        //     }

        //     // Filter for time 
        //     if (!string.IsNullOrWhiteSpace(time))
        //     {
        //         var timeParts = time.Split(':');
        //         if (timeParts.Length == 2 && int.TryParse(timeParts[0], out int hour) && int.TryParse(timeParts[1], out int minute))
        //         {
        //             DateTime searchTime = new DateTime(1, 1, 1, hour, minute, 0); // this is a dummy date for now 
        //             query = query.Where(t => t.DateTime.TimeOfDay == searchTime.TimeOfDay);
        //         }
        //     }

        //     // Filter for available seats
        //     query = query.Where(t => t.MaxRiders - t.CurrentRiders.Count >= maxRiders);

        //     return query.ToArray();
        // }
        // TODO - maybe we don't need this cause the API calls from Google Maps will give us a radius for the start and end point???????????

        // private double HaversineDistance(double lat1, double lon1, double lat2, double lon2)
        // {
        //     const double R = 6371.0; // Earth Radius in Kilometers
        //     var dLat = (lat2 - lat1) * Math.PI / 180.0;
        //     var dLon = (lon2 - lon1) * Math.PI / 180.0;

        //     var a = Math.Sin(dLat / 2.0) * Math.Sin(dLat / 2.0) +
        //             Math.Cos(lat1 * Math.PI / 180.0) * Math.Cos(lat2 * Math.PI / 180.0) *
        //             Math.Sin(dLon / 2.0) * Math.Sin(dLon / 2.0);

        //     var c = 2.0 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1.0 - a));
        //     var d = R * c;
        //     return d; // this is in kilometers
        // }
        public Trip[] SearchTrips(double? startLatitude, double? startLongitude, double? endLatitude, double? endLongitude, string dateStr, string timeStr, int seats)
        {
            IQueryable<Trip> query = _repo.Trips.Include(t => t.StartPoint).Include(t => t.EndPoint);

            // Filter for start location
            if (startLatitude.HasValue && startLongitude.HasValue)
            {
                // Assuming you want to find exact matches
                query = query.Where(t => t.StartPoint.Latitude == startLatitude.Value && t.StartPoint.Longitude == startLongitude.Value);
            }

            // Filter for end location
            if (endLatitude.HasValue && endLongitude.HasValue)
            {
                query = query.Where(t => t.EndPoint.Latitude == endLatitude.Value && t.EndPoint.Longitude == endLongitude.Value);
            }

            // Filter for date
            if (DateTime.TryParse(dateStr, out DateTime searchDate))
            {
                query = query.Where(t => t.DateTime.Date == searchDate.Date);
            }

            // Filter for time 
            if (!string.IsNullOrWhiteSpace(timeStr))
            {
                var parts = timeStr.Split(':');
                if (parts.Length == 2 &&
                    int.TryParse(parts[0], out int hours) &&
                    int.TryParse(parts[1], out int minutes))
                {
                    DateTime searchTime = new DateTime(1, 1, 1, hours, minutes, 0); // Using a dummy date here
                    query = query.Where(t => t.DateTime.TimeOfDay == searchTime.TimeOfDay);
                }
            }

            // Filter for the available seats
            query = query.Where(t => t.MaxRiders - t.CurrentRiders.Count >= seats);

            return query.ToArray();
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