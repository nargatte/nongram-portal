using System.Data.Entity;
using System.Web.Mvc;
using NonogramPortalApi.DataBase;
using Unity;
using Unity.Lifetime;
using Unity.Mvc5;
using Microsoft.AspNet.Identity;
using NonogramPortalApi.DataBase.Entities;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security;
using Unity.Injection;
using System.Web;
using NonogramPortalApi.Providers;

namespace NonogramPortalApi
{
    public static class UnityConfig
    {
        public static void RegisterComponents()
        {
            var container = new UnityContainer();

            // register all your components with the container here
            // it is NOT necessary to register your controllers

            // e.g. container.RegisterType<ITestService, TestService>();

            RegisterTypes(container);

            DependencyResolver.SetResolver(new UnityDependencyResolver(container));
        }

        public static UnityResolver GetResorver()
        {
            var container = new UnityContainer();

            // register all your components with the container here
            // it is NOT necessary to register your controllers

            // e.g. container.RegisterType<ITestService, TestService>();

            RegisterTypes(container);

            return new UnityResolver(container);
        }

        private static void RegisterTypes(UnityContainer container)
        {
            container.RegisterType<DbContext, PortalDbContext>();
            container.RegisterType<IPortalDbContext, PortalDbContext>();
            container.RegisterType<IUserStore<User>, UserStore<User>>();
            container.RegisterType<ApplicationUserManager>();
            container.RegisterType<UserManager<User>, ApplicationUserManager>();
            container.RegisterType<IAuthenticationManager>(new InjectionFactory(c =>
                HttpContext.Current.GetOwinContext().Authentication));
            //container.RegisterType<ApplicationSignInManager>();
        }
    }
}