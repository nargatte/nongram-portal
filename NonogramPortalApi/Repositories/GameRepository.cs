using System;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using NonogramPortalApi.DataBase;
using NonogramPortalApi.DataBase.Entities;

namespace NonogramPortalApi.Repositories
{
    public class GameRepository
    {
        private readonly IPortalDbContext _dbContext;

        public GameRepository(IPortalDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<int> StartGame(string userId, int nonogramId)
        {
            Game game = new Game()
            {
                StartDate = DateTime.Now,
                NonogramId = nonogramId,
                UserId = userId,
                LastSaveDate = DateTime.Now
            };
            _dbContext.Games.Add(game);
            await _dbContext.SaveChangesAsync();
            return game.Id;
        }

        public async Task SaveProgress(int id, byte[] fields)
        {
            Game game = await _dbContext.Games.FirstOrDefaultAsync(g => g.Id == id);
            if(game == null)
                throw new Exception($"Game with id {id} cannot be found");
            game.Fields = fields;
            game.LastSaveDate = DateTime.Now;
            await _dbContext.SaveChangesAsync();
        }

        public async Task EndGame

    }
}