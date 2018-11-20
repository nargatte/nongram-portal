using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(NonogramPortal.Startup))]
namespace NonogramPortal
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
