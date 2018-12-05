using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using NonogramPortalApi.DataBase;
using NonogramPortalApi.DataBase.Entities;

namespace NonogramPortalApi.Controllers
{
    [System.Web.Http.Authorize]
    [System.Web.Http.RoutePrefix("api")]
    public class ValuesController : ApiController
    {
        private IPortalDbContext _dbContext;
        private UserManager<User> _userManager;

        public ValuesController(IPortalDbContext dbContext, UserManager<User> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("Nonograms")]
        public Task<string[]> GetNonograms()
        {
            string id = User.Identity.GetUserId();
             return _dbContext.Nonograms.Where(n => n.UserId == id).OrderBy(n => n.Name)
                .Select(n => n.Name).ToArrayAsync();
        }
        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("Nonogram")]
        public async Task PostNonogram(string name)
        {
            var n = new Nonogram(){UserId = User.Identity.GetUserId(), CreationDate = DateTime.Now, Name = name};
            _dbContext.Nonograms.Add(n);
            await _dbContext.SaveChangesAsync();
        }

        // GET api/values
        public async Task<string[]> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }
    }
}
