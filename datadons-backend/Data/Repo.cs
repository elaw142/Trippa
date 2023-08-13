using Models;
using Data; 


namespace Data{
    public class Repo : IRepo{
        private readonly DonsDbContext _repo;
        public Repo(DonsDbContext repo){
            _repo = repo;
        }

        public void AddUser(User user){
            _repo.Users.Add(user);
        }

    }
}