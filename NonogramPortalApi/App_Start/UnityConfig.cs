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
using NonogramPortalApi.Repositories;
using System;

namespace NonogramPortalApi
{
    public static class UnityConfig
    {
        private static UnityContainer _container;

        private static UnityContainer Container
        {
            get
            {
                if (_container == null)
                {
                    _container = new UnityContainer();
                    RegisterTypes(_container);
                }
                return _container;
            }
        }

        public static void RegisterComponents()
        {
            DependencyResolver.SetResolver(new UnityDependencyResolver(Container));
        }

        public static UnityResolver GetResorver()
        {
            return new UnityResolver(Container);
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
            container.RegisterType<NonogramRepository>();
            container.RegisterType<Random>();
            //container.RegisterType<ApplicationSignInManager>();
        }
    }
}