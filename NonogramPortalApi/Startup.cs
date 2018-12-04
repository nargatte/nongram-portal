using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin;
using NonogramPortalApi.DataBase;
using NonogramPortalApi.DataBase.Entities;
using Owin;

[assembly: OwinStartup(typeof(NonogramPortalApi.Startup))]

namespace NonogramPortalApi
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            createRolesandUsers();
        }
        private string[] rolesStrings =
        {
            "Player",
            "Moderator",
        };

        private void createRolesandUsers()
        {
            PortalDbContext context = new PortalDbContext();

            var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));
            var userManager = new UserManager<User>(new UserStore<User>(context));

            foreach (string s in rolesStrings)
            {
                if (!roleManager.RoleExists(s))
                {
                    var role = new IdentityRole();
                    role.Name = s;
                    roleManager.Create(role);
                }
            }

            if (!userManager.Users.Any(u => u.UserName == "admin@t2w.pl"))
            {

                var user = new User();
                user.UserName = "admin@np.pl";
                user.Email = "admin@np.pl";

                string userPWD = "admin1";

                var chkUser = userManager.Create(user, userPWD);

                if (chkUser.Succeeded)
                {
                    var result1 = userManager.AddToRole(user.Id, "Moderator");
                }
            }
        }
    }
}
