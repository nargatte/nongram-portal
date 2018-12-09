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
using NonogramPortalApi.Dtos;
using NonogramPortalApi.Models;
using NonogramPortalApi.Repositories;

namespace NonogramPortalApi.Controllers
{
    [System.Web.Http.RoutePrefix("api")]
    public class ValuesController : ApiController
    {
        private readonly IPortalDbContext _dbContext;
        private readonly UserManager<User> _userManager;
        private readonly NonogramRepository _nonogramRepository;

        public ValuesController(IPortalDbContext dbContext, UserManager<User> userManager, NonogramRepository nonogramRepository)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _nonogramRepository = nonogramRepository;
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
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.UserName == "admin@np.pl");
            NonogramDto nonogramDto = new NonogramDto();
            nonogramDto.Name = "Name";
            nonogramDto.UserId = user.Id;
            nonogramDto.Dimensions = new byte[] {1,4,6,1};
            nonogramDto.CreationDate = DateTime.Now;
            nonogramDto.Colors = new[]
            {
                new ColourDto() {Red = 1, Green = 1, Blue = 1},
                new ColourDto() {Red = 2, Green = 2, Blue = 2},
            };

            await _nonogramRepository.AddNonogram(nonogramDto);

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
