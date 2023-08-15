using Models;
using Data; 


namespace Data{
    public class Repo : IRepo{
        private readonly DonsDbContext _repo;
        public Repo(DonsDbContext repo){
            _repo = repo;
        }

        public string AddUser(User user){
            _repo.Users.Add(user);
            _repo.SaveChanges();
            return user.Username;
        }

        public User GetUser(long id){
            return _repo.Users.FirstOrDefault(u => u.Id == id);
        }

        public User[] GetAllUsers(){
            User[] c =  _repo.Users.ToArray();
            return c;
        }
    }
}