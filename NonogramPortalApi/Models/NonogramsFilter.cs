using NonogramPortalApi.Enums;

namespace NonogramPortalApi.Models
{
    public class NonogramsFilter
    {
        public NonogramSortOption NonogramSortOption { get; set; }
        public bool Descending { get; set; }
        public int? MinDimension { get; set; }
        public int? MaxDimension { get; set; }
        public int? MinColors { get; set; }
        public int? MaxColors { get; set; }
        public string UserId { get; set; }
        public AccessMode? AccessMode { get; set; }
    }
}