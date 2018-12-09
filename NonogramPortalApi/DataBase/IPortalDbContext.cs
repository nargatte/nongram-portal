using System.Data.Entity;
using System.Threading.Tasks;
using NonogramPortalApi.DataBase.Entities;

namespace NonogramPortalApi.DataBase
{
    public interface IPortalDbContext
    {
        IDbSet<Comment> Comments { get; set; }
        IDbSet<Game> Games { get; set; }
        IDbSet<Nonogram> Nonograms { get; set; }
        IDbSet<Dimension> Dimensions { get; set; }
        IDbSet<Color> Colors { get; set; }

        Task<int> SaveChangesAsync();
    }
}