using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace NonogramPortalApi.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
           // return Redirect("~/help");
            return Redirect("~/api/values");
        }
    }
}
