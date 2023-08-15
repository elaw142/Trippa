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
    }
}