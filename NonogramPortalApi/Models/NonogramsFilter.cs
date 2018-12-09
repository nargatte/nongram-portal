using NonogramPortalApi.Enums;

namespace NonogramPortalApi.Models
{
    public class NonogramsFilter
    {
        public NonogramSortOption NonogramSortOption { get; set; }
        public bool Descending { get; set; }

        public byte? MinDimension { get; set; }
        public byte? MaxDimension { get; set; }

        public int? MinSize { get; set; }
        public int? MaxSize { get; set; }

        public byte? MinColors { get; set; }
        public byte? MaxColors { get; set; }

        public string UserIdOwner { get; set; }
        public string UserIdPlayer { get; set; }
        public bool HideThatAlreadyPlayed { get; set; }

        public AccessMode? AccessMode { get; set; }
    }
}