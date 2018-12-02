using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using NonogramPortalApi.DataBase;
using NonogramPortalApi.DataBase.Entities;

namespace NonogramPortalApi.Controllers
{
    [System.Web.Http.Authorize]
    public class ValuesController : ApiController
    {
        private IPortalDbContext _dbContext;
        private UserManager<User> _userManager;

        public ValuesController(IPortalDbContext dbContext, UserManager<User> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        // GET api/values
        public async Task<string[]> Get()
        {
            string s = User.Identity.GetUserId();
            var nonogram = await _dbContext.Nonograms.FirstAsync(n => n.UserId == s);

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
