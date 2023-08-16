using Models;

namespace Data
{
    public interface IRepo
    {
        string AddUser(User user);
        User GetUser(long id);
        User[] GetAllUsers();
        Trip GetTrip(long id);
        Trip[] GetAllTrips();
        Trip[] SearchTrips(double? startLatitude, double? startLongitude, double? endLatitude, double? endLongitude, string date, string time, int seats);
        Trip[] GetAllTripsBy(long driverID);
        void DeleteTrip(long id);
        void UpdateTrip(Trip trip);
        long AddTrip(Trip trip);
    }
}