using System.Data.Entity;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity.EntityFramework;
using NonogramPortalApi.DataBase.Entities;

namespace NonogramPortalApi.DataBase
{
    public class PortalDbContext : IdentityDbContext<User>, IPortalDbContext
    {
        public PortalDbContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
        }

        public IDbSet<Comment> Comments { get; set; }
        public IDbSet<Game> Games { get; set; }
        public IDbSet<Nonogram> Nonograms { get; set; }
        public IDbSet<Dimension> Dimensions { get; set; }
        public IDbSet<Colour> Colours { get; set; }
    }
}